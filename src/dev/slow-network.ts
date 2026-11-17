export function simulateSlowNetwork(to: string, signal?: AbortSignal): Promise<void> {
  const ms = to === 'Porto' ? 3000 : 300;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}