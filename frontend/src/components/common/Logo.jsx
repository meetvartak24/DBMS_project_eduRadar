import React from 'react';
import { Radar } from 'lucide-react';

export function Logo() {
  return (
    <div className="logo">
      <span>
        <Radar size={25} />
      </span>
      edu<span className="logo-end">radar</span>
      <i>°</i>
    </div>
  );
}
