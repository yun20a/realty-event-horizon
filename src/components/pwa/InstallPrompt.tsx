
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
    'appinstalled': Event;
  }
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const ua = window.navigator.userAgent;
    const isIOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = !!ua.match(/Safari/i);
    const isStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone;
    
    setIsIOS(isIOS && isSafari && !isStandalone);

    // Listen for the beforeinstallprompt event
    const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e);
      // Show the install button
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    // When the app is installed, hide the install button
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      toast.success('App installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Thank you for installing our app!');
    } else {
      toast.info('App installation cancelled');
    }
    
    // Clear the prompt so it can be garbage collected
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  if (!isInstallable && !isIOS) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-16 inset-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-blue-800 z-40">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Install This App</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Tap the share icon and select "Add to Home Screen"
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => toast.info('Look for the share icon in your browser')}
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 inset-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-blue-800 z-40">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Download className="h-5 w-5 text-blue-600 dark:text-blue-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">Install This App</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Install this app on your device for offline use
          </p>
          <div className="flex gap-2">
            <Button 
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleInstallClick}
            >
              Install
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsInstallable(false)}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
