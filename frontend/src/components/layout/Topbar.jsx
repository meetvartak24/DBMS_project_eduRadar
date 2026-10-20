import React from 'react';
import { ChevronRight, Menu } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton.jsx';

export function Topbar({ mobile, setMobile, page, preview, pwa }) {
  return (
    <header className="topbar">
      <div>
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          onClick={() => setMobile(!mobile)}
        >
          <Menu />
        </button>
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>{page}</strong>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {pwa && <PWAInstallButton pwa={pwa} />}
        {pwa?.isOffline ? (
          <span className="live-pill offline" title="Offline mode">
            <i />
            Offline mode
          </span>
        ) : (
          <span className="live-pill">
            <i />
            {preview ? 'Demo preview' : 'Campus connected'}
          </span>
        )}
      </div>
    </header>
  );
}
