import { Router } from 'express';
import { youtubeService } from './youtube.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  try {
    const url = youtubeService.getAuthUrl();
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
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent('No authorization code received from Google')}`);
  }

  const result = await youtubeService.handleOAuthCallback(code);
  if (result.success) {
    const redirectParams = new URLSearchParams({
      youtube_connected: 'true',
      name: result.account.name || 'YouTube Channel',
      handle: result.account.handle || '@YouTube',
      avatar: result.account.avatar || '',
      followers: (result.account.followers || 0).toString()
    });
    return res.redirect(`${frontendUrl}/accounts?${redirectParams.toString()}`);
  } else {
    return res.redirect(`${frontendUrl}/accounts?error=${encodeURIComponent(result.error || 'YouTube connection failed')}`);
  }
});

router.post('/connect', async (req, res) => {
  const result = await youtubeService.connect(req.body);
  res.json(result);
});

router.post('/publish', async (req, res) => {
  const result = await youtubeService.publish(req.body);
  if (result.success) res.json(result);
  else res.status(400).json(result);
});

router.post('/disconnect', async (req, res) => {
  const result = await youtubeService.disconnect(req.body.accountId);
  res.json(result);
});

export default router;

