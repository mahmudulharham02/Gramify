import { registerSW } from 'virtual:pwa-register';

export function registerPwaServiceWorker(options?: {
  onOfflineReady?: () => void;
  onNeedRefresh?: () => void;
}) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onOfflineReady() {
        console.log('[Gramify PWA] App is ready to work offline.');
        options?.onOfflineReady?.();
      },
      onNeedRefresh() {
        console.log('[Gramify PWA] New content available, reloading...');
        options?.onNeedRefresh?.();
        // Auto update when ready
        updateSW(true);
      },
      onRegisterError(error) {
        console.warn('[Gramify PWA] Service worker registration error:', error);
      },
    });

    return updateSW;
  }
  return null;
}
