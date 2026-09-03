'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/types';
import { getStoredPosts, saveStoredPosts } from '@/lib/store';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getStoredPosts());
  }, []);

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    saveStoredPosts(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <CalendarGrid posts={posts} onDeletePost={handleDeletePost} />
    </div>
  );
}
