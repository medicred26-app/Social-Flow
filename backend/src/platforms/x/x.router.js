import { Router } from 'express';
import { xService } from './x.service.js';

const router = Router();

router.get('/oauth', (req, res) => {
  res.redirect(xService.getAuthUrl());
});

router.post('/connect', async (req, res) => {
  const result = await xService.connect(req.body);
  res.json(result);
});

router.post('/publish', async (req, res) => {
  const result = await xService.publish(req.body);
  if (result.success) res.json(result);
  else res.status(400).json(result);
});

router.post('/disconnect', async (req, res) => {
  const result = await xService.disconnect(req.body.accountId);
  res.json(result);
});

export default router;
