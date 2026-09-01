import { createClient } from '@/lib/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { supabase, user: null as null };
  }

  const meta = data.user.user_metadata || {};
  await supabase.from('profiles').upsert({
    id: data.user.id,
    email: data.user.email,
    name: meta.name || meta.full_name || (data.user.email ? data.user.email.split('@')[0] : 'User'),
    avatar_url: meta.avatar_url || meta.picture || null,
  });

  return { supabase, user: data.user };
}
