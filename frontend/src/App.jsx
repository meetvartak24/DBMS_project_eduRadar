import React from 'react';
import { useEffect, useState } from 'react';
import { api } from './services/api.js';
import { demo } from './data/demo.js';
import { Logo } from './components/common/Logo.jsx';
import { Auth } from './pages/Auth.jsx';
import { Dashboard } from './pages/Dashboard.jsx';

export function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
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
      <div className="loading">
        <Logo />
        <p>Opening your campus…</p>
      </div>
    );
  return user ? (
    <Dashboard
      user={user}
      preview={preview}
      logout={async () => {
        if (!preview) await api('/logout', 'POST', {});
        setUser(null);
        setPreview(false);
      }}
    />
  ) : (
    <Auth
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
  );
}
