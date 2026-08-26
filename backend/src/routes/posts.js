import { Router } from 'express';

const router = Router();

let postsQueue = [
  {
    id: 'post_1',
    caption: '🚀 Launching our new summer social media automation suite! Schedule posts seamlessly across 5 platforms with SocialFlow.',
    targets: [
      { platform: 'twitter', handle: '@socialflow', status: 'published', publishedAt: '2026-08-22T10:00:00Z' },
      { platform: 'linkedin', handle: 'SocialFlow Inc', status: 'published', publishedAt: '2026-08-22T10:00:00Z' }
    ],
    scheduledFor: '2026-08-22T10:00:00Z',
    status: 'published',
    mediaUrls: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'],
    createdAt: '2026-08-21T14:30:00Z'
  },
  {
    id: 'post_2',
    caption: '💡 Pro Tip: Consistency is key to growing your online presence. Use automated scheduling to keep your audience engaged 24/7.',
    targets: [
      { platform: 'instagram', handle: '@socialflow_app', status: 'scheduled' },
      { platform: 'facebook', handle: 'SocialFlow Page', status: 'scheduled' }
    ],
    scheduledFor: '2026-08-24T15:00:00Z',
    status: 'scheduled',
    mediaUrls: [],
    createdAt: '2026-08-23T08:00:00Z'
  }
];

// GET all posts
router.get('/', (req, res) => {
  const { status, limit } = req.query;
  let result = [...postsQueue];

  if (status) {
    result = result.filter(p => p.status === status);
  }

  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    count: result.length,
    posts: result
  });
});

// POST create scheduled post
router.post('/', (req, res) => {
  const { caption, targets, scheduledFor, mediaUrls } = req.body;

  if (!caption || !targets || targets.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Caption and at least one target platform are required.'
    });
  }

  const newPost = {
    id: `post_${Date.now()}`,
    caption,
    targets,
    scheduledFor: scheduledFor || new Date().toISOString(),
    status: 'scheduled',
    mediaUrls: mediaUrls || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  postsQueue.unshift(newPost);

  return res.status(201).json({
    success: true,
    message: 'Post scheduled successfully via SocialFlow Backend',
    post: newPost
  });
});

// DELETE post
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = postsQueue.length;
  postsQueue = postsQueue.filter(p => p.id !== id);

  if (postsQueue.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  res.json({ success: true, message: 'Post deleted successfully.' });
});

export default router;
