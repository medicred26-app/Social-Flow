'use client';

import React, { useEffect, useState } from 'react';
import { Post } from '@/types';
import { deletePost, fetchPosts } from '@/lib/data/api';
import { useAuth } from '@/lib/auth-context';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

export default function CalendarPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchPosts(token)
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <CalendarGrid
        posts={posts}
        onDeletePost={async (id) => {
          if (!token) return;
          await deletePost(token, id);
          setPosts((current) => current.filter((p) => p.id !== id));
        }}
      />
    </div>
  );
}
