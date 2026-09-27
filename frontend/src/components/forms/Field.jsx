import React from 'react';

export function Field({ label, ...props }) {
  return (
    <label className="field">
      {label}
      <input {...props} />
    </label>
  );
}
