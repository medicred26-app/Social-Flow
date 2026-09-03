import { Router } from 'express';
import { linkedinService } from './linkedin.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  res.redirect(linkedinService.getAuthUrl());
});

router.post('/connect', async (req, res) => {
  const result = await linkedinService.connect(req.body);
  res.json(result);
});

router.post('/publish', async (req, res) => {
  const result = await linkedinService.publish(req.body);
  if (result.success) res.json(result);
  else res.status(400).json(result);
});

router.post('/disconnect', async (req, res) => {
  const result = await linkedinService.disconnect(req.body.accountId);
  res.json(result);
});

export default router;
