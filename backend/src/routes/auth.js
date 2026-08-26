import { Router } from 'express';

const router = Router();

// In-memory user store for backend demonstration (persistable to Firebase/DB)
const usersDb = [
  {
    id: 'user_1',
    email: 'demo@socialflow.app',
    name: 'Demo Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    provider: 'email'
  }
];

// GET Google Auth Config
router.get('/google-config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  res.json({
    configured: !!clientId && !clientId.includes('your-google-client-id'),
    clientId: clientId || null,
    message: clientId ? 'Google OAuth Client ID is loaded' : 'Google OAuth Client ID not set in backend .env'
  });
});

// POST Login Endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  let user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Auto create demo account for seamless developer onboarding
    user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      provider: 'email'
    };
    usersDb.push(user);
  }

  const token = `sf_jwt_token_${user.id}_${Date.now()}`;

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user
  });
});

// POST Signup Endpoint
router.post('/signup', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    provider: 'email'
  };

  usersDb.push(newUser);
  const token = `sf_jwt_token_${newUser.id}_${Date.now()}`;

  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: newUser
  });
});

// POST Google OAuth Login / Verify Endpoint
router.post('/google', (req, res) => {
  const { credential, clientId, user: googleUser } = req.body;

  if (!credential && !googleUser && !clientId) {
    return res.status(400).json({ success: false, message: 'Google authentication credential or user payload required.' });
  }

  let email = googleUser?.email;
  let name = googleUser?.name;
  let avatar = googleUser?.picture;

  // If JWT credential passed from Google Identity Services script:
  if (credential && typeof credential === 'string') {
    try {
      // Decode JWT payload (standard base64 json decode of token payload)
      const base64Url = credential.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        email = payload.email || email;
        name = payload.name || name;
        avatar = payload.picture || avatar;
      }
    } catch (e) {
      console.warn('Failed to parse Google JWT payload directly, relying on provided attributes:', e);
    }
  }

  if (!email) {
    email = `google_user_${Date.now()}@socialflow.app`;
  }

  let user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `google_user_${Date.now()}`,
      email,
      name: name || 'Google User',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      provider: 'google'
    };
    usersDb.push(user);
  } else {
    // Update profile info
    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user.provider = 'google';
  }

  const token = `sf_google_token_${user.id}_${Date.now()}`;

  return res.json({
    success: true,
    message: 'Google Sign-In successful',
    token,
    user
  });
});

// GET Initiates Facebook OAuth 2.0 Login
router.get('/facebook', (req, res) => {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI || 'http://localhost:5000/api/auth/facebook/callback';
  const scope = 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts';

  if (!appId) {
    return res.status(500).json({ 
      success: false, 
      message: 'META_APP_ID is not configured in backend .env' 
    });
  }

  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${encodeURIComponent(appId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
  return res.redirect(authUrl);
});

// GET Facebook OAuth 2.0 Callback Handler
router.get('/facebook/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';

  if (error) {
    console.error('[Facebook OAuth Callback Error]', error, error_description);
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent('No authorization code received from Facebook')}`);
  }

  try {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI || 'http://localhost:5000/api/auth/facebook/callback';

    // 1. Exchange authorization code for User Access Token via official Meta API
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code: code
    });

    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('[Facebook Token Exchange Error]', tokenData.error);
      return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(tokenData.error.message || 'Token exchange failed')}`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile from Meta Graph API
    const profileResponse = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=${encodeURIComponent(accessToken)}`);
    const profileData = await profileResponse.json();

    // 3. Fetch User Facebook Pages (if available) from Meta Graph API
    let pages = [];
    try {
      const pagesResponse = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${encodeURIComponent(accessToken)}`);
      const pagesData = await pagesResponse.json();
      if (pagesData.data) {
        pages = pagesData.data;
      }
    } catch (err) {
      console.warn('[Facebook Pages Fetch Warning]', err);
    }

    const accountName = pages.length > 0 ? pages[0].name : (profileData.name || 'Facebook Official');
    const handle = `@${accountName.toLowerCase().replace(/[^a-z0-9._]/g, '')}`;
    const avatarUrl = profileData.picture?.data?.url || `https://graph.facebook.com/v19.0/${profileData.id}/picture?type=large`;
    const followerCount = pages.length > 0 && pages[0].fan_count ? pages[0].fan_count : 24500;

    // Pass result back to frontend
    const redirectParams = new URLSearchParams({
      facebook_connected: 'true',
      name: accountName,
      handle: handle,
      avatar: avatarUrl,
      followers: followerCount.toString()
    });

    return res.redirect(`${frontendUrl}/accounts?${redirectParams.toString()}`);
  } catch (err) {
    console.error('[Facebook OAuth Callback Exception]', err);
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(err.message || 'Facebook authentication failed')}`);
  }
});

export default router;

