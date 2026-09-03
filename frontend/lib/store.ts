import { Post, SocialAccount, SocialPlatform, MediaItem } from '@/types';
import { INITIAL_MOCK_ACCOUNTS } from './constants';

const STORAGE_KEY_POSTS = 'socialflow_posts_v1';
const STORAGE_KEY_ACCOUNTS = 'socialflow_accounts_v1';

const INITIAL_MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    caption: '🚀 Excited to announce our newest product update! Custom analytics and automated multi-platform queue management are now live in SocialFlow. Check out the link in bio for full details! #SaaS #BuildInPublic #Productivity',
    media: [
      {
        id: 'm-1',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'dashboard-preview.png',
        size: '1.2 MB'
      }
    ],
    targets: [
      { platform: 'x', accountId: 'acc-x-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'tw-109283' },
      { platform: 'linkedin', accountId: 'acc-li-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'li-992102' },
      { platform: 'facebook', accountId: 'acc-fb-1', status: 'published', publishedAt: '2026-08-19T14:00:00Z', platformPostId: 'fb-448201' }
    ],
    scheduledFor: '2026-08-19T14:00:00Z',
    status: 'published',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-19T14:00:00Z',
    userId: 'user-demo',
    analytics: {
      impressions: 4820,
      likes: 312,
      shares: 48,
      comments: 29,
      clicks: 184
    }
  },
  {
    id: 'post-2',
    caption: '💡 Quick tip for content creators: Consistency > Perfection. Batch your content scheduling once a week to free up focus time for deep work. What is your favorite scheduling strategy?',
    media: [
      {
        id: 'm-2',
        url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'productivity-tip.jpg',
        size: '840 KB'
      }
    ],
    targets: [
      { platform: 'instagram', accountId: 'acc-ig-1', status: 'pending' },
      { platform: 'x', accountId: 'acc-x-1', status: 'pending' }
    ],
    scheduledFor: '2026-08-21T16:30:00Z',
    status: 'scheduled',
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-08-20T09:00:00Z',
    userId: 'user-demo'
  },
  {
    id: 'post-3',
    caption: 'Behind the scenes video walkthrough of how our scheduling engine processes hundreds of social targets per minute seamlessly! 🍿🎬',
    media: [],
    targets: [
      { platform: 'linkedin', accountId: 'acc-li-1', status: 'pending' },
      { platform: 'facebook', accountId: 'acc-fb-1', status: 'pending' }
    ],
    scheduledFor: '2026-08-22T11:00:00Z',
    status: 'scheduled',
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-08-20T12:00:00Z',
    userId: 'user-demo'
  }
];

export function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_MOCK_POSTS));
      return INITIAL_MOCK_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load posts from storage', e);
    return INITIAL_MOCK_POSTS;
  }
}

export function saveStoredPosts(posts: Post[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to storage', e);
  }
}

export function getStoredAccounts(): SocialAccount[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(INITIAL_MOCK_ACCOUNTS));
      return INITIAL_MOCK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load accounts from storage', e);
    return INITIAL_MOCK_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts: SocialAccount[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to storage', e);
  }
}
