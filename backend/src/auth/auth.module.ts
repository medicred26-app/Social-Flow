import { createParamDecorator, ExecutionContext, Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthUser } from '../types';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const AccessToken = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.accessToken;
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) {
      throw new UnauthorizedException('Sign in required.');
    }

    const user = await this.supabase.getUserFromToken(token);
    if (!user) {
      throw new UnauthorizedException('Sign in required.');
    }

    const client = this.supabase.getUserClient(token);
    await this.supabase.ensureProfile(client, user);

    request.user = user;
    request.accessToken = token;
    request.supabase = client;
    return true;
  }
}

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
