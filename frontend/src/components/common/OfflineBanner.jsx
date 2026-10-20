import React from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner({ isOffline }) {
  if (!isOffline) return null;

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <WifiOff size={16} />
      <span>Offline Mode — you are viewing cached campus data.</span>
    </div>
  );
}
