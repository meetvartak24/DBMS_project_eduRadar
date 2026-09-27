import React from 'react';

export function Select({ label, children, ...props }) {
  return (
    <label className="field">
      {label}
      <select {...props}>{children}</select>
    </label>
  );
}
