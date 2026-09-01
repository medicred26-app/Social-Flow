// Shared persistence helper for users & connected social accounts
import { supabase } from './supabase.js';

const usersDb = [
  {
    id: 'user_1',
    email: 'demo@socialflow.app',
    name: 'Demo Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    provider: 'email'
  }
];

const connectedAccountsDb = new Map();

export function findUserByEmail(email) {
  if (!email) return null;
  return usersDb.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function saveUser(user) {
  const index = usersDb.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    usersDb[index] = { ...usersDb[index], ...user };
    return usersDb[index];
  }
  usersDb.push(user);
  return user;
}

export async function saveConnectedAccount(platform, accountData) {
  const key = `${platform}_${accountData.id || accountData.handle}`;
  const record = {
    ...accountData,
    platform,
    updatedAt: new Date().toISOString()
  };

  connectedAccountsDb.set(key, record);

  try {
    if (supabase) {
      await supabase.from('social_accounts').upsert({
        account_key: key,
        platform,
        account_id: accountData.id || '',
        name: accountData.name || '',
        handle: accountData.handle || '',
        avatar: accountData.avatar || '',
        followers: accountData.followers || 0,
        access_token: accountData.accessToken || '',
        status: accountData.status || 'connected',
        updated_at: record.updatedAt
      }, { onConflict: 'account_key' });
    }
  } catch (err) {
    console.warn('[Supabase Sync] Warning: Could not persist social_accounts to Supabase table, using memory fallback:', err.message);
  }

  return record;
}

export function getConnectedAccounts(platform = null) {
  const accounts = Array.from(connectedAccountsDb.values());
  if (!platform) return accounts;
  return accounts.filter(a => a.platform === platform);
}

export async function disconnectConnectedAccount(platform, accountId) {
  const keyPattern = accountId ? `${platform}_${accountId}` : null;
  for (const [key, acc] of connectedAccountsDb.entries()) {
    if (acc.platform === platform && (!keyPattern || key === keyPattern)) {
      connectedAccountsDb.set(key, {
        ...acc,
        status: 'disconnected',
        handle: '',
        name: '',
        avatar: '',
        followers: 0,
        updatedAt: new Date().toISOString()
      });
    }
  }

  try {
    if (supabase) {
      await supabase.from('social_accounts')
        .update({ status: 'disconnected', updated_at: new Date().toISOString() })
        .eq('platform', platform);
    }
  } catch (err) {
    console.warn('[Supabase Sync] Warning: Could not update disconnect status in Supabase:', err.message);
  }

  return { success: true };
}

export async function deleteConnectedAccount(platform, accountId) {
  const keyPattern = accountId ? `${platform}_${accountId}` : null;
  for (const [key, acc] of connectedAccountsDb.entries()) {
    if (acc.platform === platform && (!keyPattern || key === keyPattern)) {
      connectedAccountsDb.delete(key);
    }
  }

  try {
    if (supabase) {
      const query = supabase.from('social_accounts').delete().eq('platform', platform);
      if (accountId) query.eq('account_id', accountId);
      await query;
    }
  } catch (err) {
    console.warn('[Supabase Sync] Warning: Could not delete account credentials from Supabase:', err.message);
  }

  return { success: true };
}
