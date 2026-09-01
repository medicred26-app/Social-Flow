export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.ENABLE_INLINE_SCHEDULER === 'true') {
    const { startScheduler } = await import('./lib/server/scheduler');
    startScheduler();
  }
}
