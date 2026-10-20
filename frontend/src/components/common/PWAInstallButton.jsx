import React, { useState } from 'react';
import { Smartphone, Download, Share, X, Check } from 'lucide-react';

export function PWAInstallButton({ pwa, className = '' }) {
  const { isInstallable, isInstalled, isIOS, installApp } = pwa;
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        className={`pwa-install-btn ${className}`}
        onClick={installApp}
        title="Install EduRadar App"
      >
        <Download size={16} />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          className={`pwa-install-btn ios ${className}`}
          onClick={() => setShowIosGuide(true)}
          title="Install on iPhone / iPad"
        >
          <Smartphone size={16} />
          <span>Install App</span>
        </button>

        {showIosGuide && (
          <div className="pwa-ios-modal-overlay" onClick={() => setShowIosGuide(false)}>
            <div className="pwa-ios-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pwa-ios-header">
                <strong>Install EduRadar on iOS</strong>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowIosGuide(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <ol className="pwa-ios-steps">
                <li>
                  Tap the <strong>Share</strong> button <Share size={16} className="inline-icon" />{' '}
                  at the bottom of Safari.
                </li>
                <li>
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong>Add</strong> in the top-right corner.
                </li>
              </ol>
              <button type="button" className="primary full" onClick={() => setShowIosGuide(false)}>
                <Check size={16} /> Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
