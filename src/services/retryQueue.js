const pendingRetries = new Map();
const retryDiagnostics = new Map();
const MAX_RETRY_ATTEMPTS = 8;

const normalizeRetryKey = (key) => typeof key === 'string' && key.trim() ? key.trim().slice(0, 80) : null;
const normalizeAttempts = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0; };
const normalizeMaxAttempts = (value) => { const numeric = Number(value); return Number.isFinite(numeric) ? Math.min(MAX_RETRY_ATTEMPTS, Math.max(1, Math.floor(numeric))) : 3; };
const normalizeDetail = (value, fallback = 'Queued operation failed without a readable reason.') => typeof value === 'string' && value.trim() ? value.trim().slice(0, 160) : fallback;
const normalizeTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null;

export const enqueueRetry = ({ key, run, maxAttempts = 3 } = {}) => {
  const normalizedKey = normalizeRetryKey(key);
  if (!normalizedKey || typeof run !== 'function') return false;
  const existing = pendingRetries.get(normalizedKey);
  pendingRetries.set(normalizedKey, { run, attempts: normalizeAttempts(existing?.attempts), maxAttempts: normalizeMaxAttempts(maxAttempts) });
  retryDiagnostics.delete(normalizedKey);
  return true;
};

export const getRetryQueueSize = () => pendingRetries.size;
export const getRetryDiagnostics = () => [...retryDiagnostics.entries()].map(([key, value]) => ({ key: normalizeRetryKey(key) || 'unknown', attempts: normalizeAttempts(value?.attempts), maxAttempts: normalizeMaxAttempts(value?.maxAttempts), detail: normalizeDetail(value?.detail), at: normalizeTimestamp(value?.at) }));
export const clearRetry = (key) => { const normalizedKey = normalizeRetryKey(key); if (!normalizedKey) return false; retryDiagnostics.delete(normalizedKey); return pendingRetries.delete(normalizedKey); };
export const clearRetryQueue = () => { retryDiagnostics.clear(); return pendingRetries.clear(); };

export const flushRetryQueue = async () => {
  const results = { succeeded: 0, failed: 0, dropped: 0 };
  for (const [key, entry] of [...pendingRetries.entries()]) {
    if (!entry || typeof entry.run !== 'function') {
      pendingRetries.delete(key);
      retryDiagnostics.set(key, { attempts: 0, maxAttempts: 1, detail: 'Queued operation was malformed and was removed safely.', at: new Date().toISOString() });
      results.dropped += 1;
      continue;
    }
    try {
      await entry.run();
      pendingRetries.delete(key);
      retryDiagnostics.delete(key);
      results.succeeded += 1;
    } catch (error) {
      const attempts = normalizeAttempts(entry.attempts) + 1;
      const maxAttempts = normalizeMaxAttempts(entry.maxAttempts);
      const detail = normalizeDetail(error?.message);
      retryDiagnostics.set(key, { attempts, maxAttempts, detail, at: new Date().toISOString() });
      if (attempts >= maxAttempts) {
        pendingRetries.delete(key);
        results.dropped += 1;
      } else {
        pendingRetries.set(key, { ...entry, attempts, maxAttempts });
      }
      results.failed += 1;
    }
  }
  return results;
};
