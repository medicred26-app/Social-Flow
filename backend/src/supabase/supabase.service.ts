import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { AuthUser } from '../types';

@Injectable()
export class SupabaseService {
  constructor(private readonly config: ConfigService) {}

  private getUrl() {
    const url = this.config.get<string>('SUPABASE_URL');
    if (!url) throw new Error('SUPABASE_URL is required.');
    return url;
  }

  private getAnonKey() {
    const key = this.config.get<string>('SUPABASE_ANON_KEY');
    if (!key) throw new Error('SUPABASE_ANON_KEY is required.');
    return key;
  }

  getAdminClient(): SupabaseClient {
    const serviceRole = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRole) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required.');
    return createClient(this.getUrl(), serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  getUserClient(accessToken: string): SupabaseClient {
    return createClient(this.getUrl(), this.getAnonKey(), {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async getUserFromToken(accessToken: string): Promise<User | null> {
    const client = this.getUserClient(accessToken);
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  }

  async ensureProfile(supabase: SupabaseClient, user: AuthUser) {
    const meta = user.user_metadata || {};
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      name:
        (meta.name as string) ||
        (meta.full_name as string) ||
        (user.email ? user.email.split('@')[0] : 'User'),
      avatar_url: (meta.avatar_url as string) || (meta.picture as string) || null,
    });
  }
}
