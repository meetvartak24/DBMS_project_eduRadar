import React from 'react';
import { useEffect, useState } from 'react';
import { api } from './services/api.js';
import { demo } from './data/demo.js';
import { Logo } from './components/common/Logo.jsx';
import { Auth } from './pages/Auth.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { usePWA } from './hooks/usePWA.js';
import { OfflineBanner } from './components/common/OfflineBanner.jsx';

export function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const pwa = usePWA();

  async function refresh() {
    try {
      setUser(await api('/me'));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  if (loading)
    return (
      <>
        <OfflineBanner isOffline={pwa.isOffline} />
        <div className="loading">
          <Logo />
          <p>Opening your campus…</p>
        </div>
      </>
    );

  return (
    <>
      <OfflineBanner isOffline={pwa.isOffline} />
      {user ? (
        <Dashboard
          user={user}
          preview={preview}
          pwa={pwa}
          logout={async () => {
            if (!preview) await api('/logout', 'POST', {});
            setUser(null);
            setPreview(false);
          }}
        />
      ) : (
        <Auth
          pwa={pwa}
          onLogin={refresh}
          onPreview={() => {
            setPreview(true);
            setUser({
              ...demo.profile,
              role: 'student',
              institute_name: 'Westbridge Institute of Technology',
              institute_code: 'DEMO',
            });
          }}
        />
      )}
    </>
  );
}
