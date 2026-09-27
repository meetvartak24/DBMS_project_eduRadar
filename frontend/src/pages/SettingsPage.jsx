import React from 'react';

export function SettingsPage({ page, preview, open }) {
  return (
    page === 'Settings' && (
      <section className="panel">
        <h2>Account security</h2>
        <p className="muted">Choose a unique password with at least 10 characters.</p>
        <button className="primary" disabled={preview} onClick={() => open('password')}>
          Change password
        </button>
        {preview && <p className="footnote">Account changes are unavailable in the demo.</p>}
      </section>
    )
  );
}
