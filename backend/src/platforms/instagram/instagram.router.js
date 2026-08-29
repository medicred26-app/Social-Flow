import { Router } from 'express';
import { instagramService } from './instagram.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  res.redirect(instagramService.getAuthUrl());
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
