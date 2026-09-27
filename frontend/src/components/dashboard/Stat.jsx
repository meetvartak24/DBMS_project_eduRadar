import React from 'react';

export function Stat({ label, value, suffix, icon: Icon, detail }) {
  return (
    <section className="stat">
      <div>
        <span>{label}</span>
        <Icon size={19} />
      </div>
      <strong>
        {value}
        <small>{suffix}</small>
      </strong>
      <p>{detail}</p>
    </section>
  );
}
