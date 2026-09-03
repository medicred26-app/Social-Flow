import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthGuard, CurrentUser } from '../auth/auth.module';
import { PLATFORM_CONFIGS } from '../common/constants';
import { mapPost, PostRow, TargetRow } from '../common/mappers';
import { PublishService } from '../publish/publish.service';
import { AuthUser, SocialPlatform } from '../types';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly publish: PublishService) {}

  @Get()
  async list(@Req() req: Request, @CurrentUser() user: AuthUser) {
    const supabase = (req as Request & { supabase: SupabaseClient }).supabase;
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    const ids = (posts || []).map((p) => p.id);
    const { data: targets } = ids.length
      ? await supabase.from('post_targets').select('*').in('post_id', ids)
      : { data: [] };

    const grouped = new Map<string, TargetRow[]>();
    for (const target of (targets || []) as TargetRow[]) {
      const list = grouped.get(target.post_id) || [];
      list.push(target);
      grouped.set(target.post_id, list);
    }

    return {
      success: true,
      posts: ((posts || []) as PostRow[]).map((post) => mapPost(post, grouped.get(post.id) || [])),
    };
  }

  @Post()
  async create(@Req() req: Request, @CurrentUser() user: AuthUser, @Body() body: Record<string, unknown>) {
    const supabase = (req as Request & { supabase: SupabaseClient }).supabase;
    const caption = String(body.caption || '').trim();
    const accountIds: string[] = (body.accountIds as string[]) || [];
    const publishNow = Boolean(body.publishNow);
    const scheduledFor = body.scheduledFor ? new Date(String(body.scheduledFor)).toISOString() : null;
    const mediaUrl = body.mediaUrl ? String(body.mediaUrl).trim() : null;
    const mediaType = body.mediaType === 'video' ? 'video' : mediaUrl ? 'image' : null;

    if (!caption) {
      return { success: false, message: 'Caption is required.' };
    }
    if (!accountIds.length) {
      return { success: false, message: 'Select at least one connected account.' };
    }
    if (mediaUrl && !/^https:\/\//i.test(mediaUrl)) {
      return {
        success: false,
        message: 'Upload a file from your device, then publish. Media must be an HTTPS URL.',
      };
    }

    const { data: accounts, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .in('id', accountIds);

    if (accountError) {
      return { success: false, message: accountError.message };
    }
    if (!accounts || accounts.length !== accountIds.length) {
      return { success: false, message: 'One or more selected accounts are not connected.' };
    }

    for (const account of accounts) {
      const config = PLATFORM_CONFIGS[account.platform as SocialPlatform];
      if (config.requiresMedia && !mediaUrl) {
        return { success: false, message: config.mediaHint };
      }
    }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        caption,
        media_url: mediaUrl,
        media_type: mediaType,
        scheduled_for: publishNow ? new Date().toISOString() : scheduledFor,
        status: publishNow ? 'publishing' : 'scheduled',
      })
      .select('*')
      .single();

    if (postError || !post) {
      return { success: false, message: postError?.message || 'Could not create post.' };
    }

    const targetRows = accounts.map((account) => ({
      post_id: post.id,
      account_id: account.id,
      platform: account.platform,
      status: 'pending',
    }));

    const { error: targetError } = await supabase.from('post_targets').insert(targetRows);
    if (targetError) {
      await supabase.from('posts').delete().eq('id', post.id);
      return { success: false, message: targetError.message };
    }

    if (publishNow) {
      const published = await this.publish.publishPostById(supabase, post.id, user.id);
      return {
        success: published.results.some((r) => r.success),
        postId: post.id,
        status: published.status,
        results: published.results,
      };
    }

    return {
      success: true,
      postId: post.id,
      status: 'scheduled',
      message: `Scheduled for ${scheduledFor}.`,
    };
  }

  @Delete(':id')
  async remove(@Req() req: Request, @CurrentUser() user: AuthUser, @Param('id') id: string) {
    const supabase = (req as Request & { supabase: SupabaseClient }).supabase;
    const { error } = await supabase.from('posts').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  }
}
