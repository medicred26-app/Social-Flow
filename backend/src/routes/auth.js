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

// GET Initiates Facebook OAuth 2.0 Login (Forward to independent Facebook platform router)
router.get('/facebook', (req, res) => {
  res.redirect('/api/platforms/facebook/oauth');
});

// GET Facebook OAuth 2.0 Callback Handler (Forward to independent Facebook platform router)
router.get('/facebook/callback', (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  res.redirect(`/api/platforms/facebook/oauth/callback?${query}`);
});

// GET Initiates YouTube OAuth 2.0 Login (Forward to independent YouTube platform router)
router.get('/youtube', (req, res) => {
  res.redirect('/api/platforms/youtube/oauth');
});

// GET YouTube OAuth 2.0 Callback Handler (Forward to independent YouTube platform router)
router.get('/youtube/callback', (req, res) => {
  const query = new URLSearchParams(req.query).toString();
  res.redirect(`/api/platforms/youtube/oauth/callback?${query}`);
});

export default router;

