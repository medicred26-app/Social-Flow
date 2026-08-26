import { Router } from 'express';

const router = Router();

router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      totalImpressions: 128450,
      totalEngagement: 14920,
      engagementRate: '4.8%',
      scheduledPosts: 12,
      publishedPosts: 148,
      platformBreakdown: [
        { platform: 'Twitter/X', engagement: 4200, impressions: 38000 },
        { platform: 'LinkedIn', engagement: 5100, impressions: 41000 },
        { platform: 'Instagram', engagement: 3800, impressions: 32000 },
        { platform: 'Facebook', engagement: 1820, impressions: 17450 }
      ]
    }
  });
});

export default router;
