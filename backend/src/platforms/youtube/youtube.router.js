import { Router } from 'express';
import { youtubeService } from './youtube.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  res.redirect(youtubeService.getAuthUrl());
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
