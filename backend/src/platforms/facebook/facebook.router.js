import { Router } from 'express';
import { facebookService } from './facebook.service.js';

const router = Router();

// GET Initiate OAuth Flow
router.get('/oauth', (req, res) => {
  try {
    const url = facebookService.getAuthUrl();
    res.redirect(url);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET OAuth Callback
router.get('/oauth/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';

  if (error) {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent('No code received from Facebook')}`);
  }

  const result = await facebookService.connect({ code });
  if (result.success) {
    const redirectParams = new URLSearchParams({
      facebook_connected: 'true',
      name: result.account.name || 'Facebook Account',
      handle: result.account.handle || '@facebook',
      avatar: result.account.avatar || '',
      followers: (result.account.followers || 0).toString()
    });
    return res.redirect(`${frontendUrl}/accounts?${redirectParams.toString()}`);
  } else {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(result.error)}`);
  }
});

// POST Publish to Facebook
router.post('/publish', async (req, res) => {
  const result = await facebookService.publish(req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// POST Disconnect Facebook Account
router.post('/disconnect', async (req, res) => {
  const { accountId } = req.body;
  const result = await facebookService.disconnect(accountId);
  res.json(result);
});

export default router;
