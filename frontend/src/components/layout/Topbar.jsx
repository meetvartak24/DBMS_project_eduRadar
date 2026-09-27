import React from 'react';
import { ChevronRight, Menu } from 'lucide-react';

export function Topbar({ mobile, setMobile, page, preview }) {
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
      <span className="live-pill">
        <i />
        {preview ? 'Demo preview' : 'Campus connected'}
      </span>
    </header>
  );
}
