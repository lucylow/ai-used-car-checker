const pendingRetries = new Map();

export const enqueueRetry = ({ key, run, maxAttempts = 3 }) => {
  if (!key || typeof run !== 'function') return false;
  const existing = pendingRetries.get(key);
  pendingRetries.set(key, { run, attempts: existing?.attempts || 0, maxAttempts });
  return true;
};

export const getRetryQueueSize = () => pendingRetries.size;

export const clearRetry = (key) => pendingRetries.delete(key);

export const clearRetryQueue = () => pendingRetries.clear();

export const flushRetryQueue = async () => {
  const results = { succeeded: 0, failed: 0, dropped: 0 };
  for (const [key, entry] of [...pendingRetries.entries()]) {
    try {
      await entry.run();
      pendingRetries.delete(key);
      results.succeeded += 1;
    } catch (_) {
      const attempts = entry.attempts + 1;
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
