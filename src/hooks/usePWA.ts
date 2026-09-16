import { useState, useEffect, useCallback } from 'react';

// Interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // 1. Detect if running in standalone / installed mode
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Register Service Worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('Samity Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('Service Worker registration skipped:', err);
          });
      });
    }

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default mini-infobar or auto-prompt
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation prompt
  const installApp = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unsupported' | 'ios'> => {
    if (isInstalled || isStandalone) {
      return 'accepted';
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
          setDeferredPrompt(null);
          setInstallSuccess(true);
          setTimeout(() => setInstallSuccess(false), 5000);
          return 'accepted';
        } else {
          return 'dismissed';
        }
      } catch (err) {
        console.warn('Error during PWA installation prompt:', err);
        return 'unsupported';
      }
    }

    if (isIOS) {
      return 'ios';
    }

    return 'unsupported';
  }, [deferredPrompt, isInstalled, isStandalone, isIOS]);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isStandalone,
    installSuccess,
    installApp
  };
}
