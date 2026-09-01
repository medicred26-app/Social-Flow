import { Router } from 'express';
import { instagramService } from './instagram.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  try {
    const url = instagramService.getAuthUrl();
    res.redirect(url);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/oauth/callback', async (req, res) => {
  const { code, error, error_description } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';

  if (error) {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent('No code received from Instagram/Meta')}`);
  }

  const result = await instagramService.connect({ code });
  if (result.success) {
    const redirectParams = new URLSearchParams({
      instagram_connected: 'true',
      name: result.account.name || 'Instagram Account',
      handle: result.account.handle || '@instagram',
      avatar: result.account.avatar || '',
      followers: (result.account.followers || 0).toString()
    });
    return res.redirect(`${frontendUrl}/accounts?${redirectParams.toString()}`);
  } else {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(result.error)}`);
  }
});

router.post('/connect', async (req, res) => {
  const result = await instagramService.connect(req.body);
  res.json(result);
});

router.post('/publish', async (req, res) => {
  const result = await instagramService.publish(req.body);
  if (result.success) res.json(result);
  else res.status(400).json(result);
});

router.post('/disconnect', async (req, res) => {
  const result = await instagramService.disconnect(req.body.accountId);
  res.json(result);
});

export default router;
