export function enqueueRetry() {
  return { queued: true };
}

export function flushRetryQueue() {
  return Promise.resolve({ flushed: 0 });
}

export function getRetryDiagnostics() {
  return { queued: 0, errors: [] };
}

export function getRetryQueueSize() {
  return 0;
}
