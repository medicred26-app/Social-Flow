import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard, CurrentUser } from '../auth/auth.module';
import { mapAccount, AccountRow } from '../common/mappers';
import { PlatformEnvService } from '../platform/platform-env.service';
import { AuthUser } from '../types';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private readonly platformEnv: PlatformEnvService) {}

  @Get()
  async list(@Req() req: Request, @CurrentUser() user: AuthUser) {
    const supabase = (req as Request & { supabase: SupabaseClient }).supabase;
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      accounts: (data as AccountRow[]).map(mapAccount),
      platforms: this.platformEnv.configuredPlatforms(),
    };
  }

  @Delete(':id')
  async remove(@Req() req: Request, @CurrentUser() user: AuthUser, @Param('id') id: string) {
    const supabase = (req as Request & { supabase: SupabaseClient }).supabase;
    const { error } = await supabase
      .from('connected_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  }
}
