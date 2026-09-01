import { Router } from 'express';
import { disconnectConnectedAccount, deleteConnectedAccount } from '../shared/utils/dbHelpers.js';

const router = Router();

const accountsDb = [
  { id: 'acc_1', platform: 'twitter', name: 'SocialFlow HQ', username: '@socialflow', followers: 14200, status: 'connected', avatar: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=150&q=80' },
  { id: 'acc_2', platform: 'linkedin', name: 'SocialFlow Inc.', username: 'company/socialflow', followers: 8900, status: 'connected', avatar: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=150&q=80' },
  { id: 'acc_3', platform: 'instagram', name: 'SocialFlow App', username: '@socialflow.app', followers: 23100, status: 'connected', avatar: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=150&q=80' },
  { id: 'acc_4', platform: 'facebook', name: 'SocialFlow Official', username: 'facebook.com/socialflow', followers: 17500, status: 'connected', avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80' },
  { id: 'acc_5', platform: 'youtube', name: 'SocialFlow Tutorials', username: '@SocialFlowTV', followers: 45000, status: 'disconnected', avatar: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=150&q=80' }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    accounts: accountsDb
  });
});

router.post('/connect', (req, res) => {
  const { platform, username } = req.body;
  if (!platform) {
    return res.status(400).json({ success: false, message: 'Platform name is required.' });
  }

  const existing = accountsDb.find(a => a.platform === platform.toLowerCase());
  if (existing) {
    existing.status = 'connected';
    existing.username = username || existing.username;
    return res.json({ success: true, message: `Reconnected ${platform} account.`, account: existing });
  }

  const newAcc = {
    id: `acc_${Date.now()}`,
    platform: platform.toLowerCase(),
    name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
    username: username || `@${platform}_user`,
    followers: 1200,
    status: 'connected',
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${platform}`
  };

  accountsDb.push(newAcc);
  res.status(201).json({ success: true, message: `Connected new ${platform} account.`, account: newAcc });
});

router.post('/disconnect', async (req, res) => {
  const { platform, accountId } = req.body;
  await disconnectConnectedAccount(platform, accountId);
  res.json({ success: true, message: `Disconnected ${platform} account successfully.` });
});

router.post('/delete-credentials', async (req, res) => {
  const { platform, accountId } = req.body;
  await deleteConnectedAccount(platform, accountId);
  res.json({ success: true, message: `Permanently deleted stored credentials for ${platform}.` });
});

export default router;

