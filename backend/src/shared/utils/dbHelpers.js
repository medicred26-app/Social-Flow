// Shared persistence helper for users & connected social accounts

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

export function saveConnectedAccount(platform, accountData) {
  connectedAccountsDb.set(`${platform}_${accountData.id || accountData.handle}`, {
    ...accountData,
    platform,
    updatedAt: new Date().toISOString()
  });
  return connectedAccountsDb.get(`${platform}_${accountData.id || accountData.handle}`);
}

export function getConnectedAccounts(platform = null) {
  const accounts = Array.from(connectedAccountsDb.values());
  if (!platform) return accounts;
  return accounts.filter(a => a.platform === platform);
}
