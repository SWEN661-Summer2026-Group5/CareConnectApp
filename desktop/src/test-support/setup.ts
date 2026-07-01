import '@testing-library/jest-dom/vitest';

// jsdom does not implement requestAnimationFrame timing precisely; provide a
// deterministic shim so focus-management effects run synchronously in tests.
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 0) as unknown as number) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((id: number) =>
    clearTimeout(id)) as typeof cancelAnimationFrame;
}
