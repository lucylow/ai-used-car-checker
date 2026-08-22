const pendingRetries = new Map();
const retryDiagnostics = new Map();

export const enqueueRetry = ({ key, run, maxAttempts = 3 }) => {
  if (!key || typeof run !== 'function') return false;
  const existing = pendingRetries.get(key);
  pendingRetries.set(key, { run, attempts: existing?.attempts || 0, maxAttempts: Math.max(1, Number(maxAttempts) || 3) });
  retryDiagnostics.delete(key);
  return true;
};

export const getRetryQueueSize = () => pendingRetries.size;
export const getRetryDiagnostics = () => [...retryDiagnostics.entries()].map(([key, value]) => ({ key, ...value }));
export const clearRetry = (key) => { retryDiagnostics.delete(key); return pendingRetries.delete(key); };
export const clearRetryQueue = () => { retryDiagnostics.clear(); return pendingRetries.clear(); };

export const flushRetryQueue = async () => {
  const results = { succeeded: 0, failed: 0, dropped: 0 };
  for (const [key, entry] of [...pendingRetries.entries()]) {
    try {
      await entry.run();
      pendingRetries.delete(key);
      retryDiagnostics.delete(key);
      results.succeeded += 1;
    } catch (error) {
      const attempts = entry.attempts + 1;
      const detail = typeof error?.message === 'string' ? error.message.slice(0, 160) : 'Queued operation failed without a readable reason.';
      retryDiagnostics.set(key, { attempts, maxAttempts: entry.maxAttempts, detail, at: new Date().toISOString() });
      if (attempts >= entry.maxAttempts) {
        pendingRetries.delete(key);
        results.dropped += 1;
      } else {
        pendingRetries.set(key, { ...entry, attempts });
      }
      results.failed += 1;
    }
  }
  return results;
};
