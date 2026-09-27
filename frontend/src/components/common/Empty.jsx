import React from 'react';
import { BookOpen } from 'lucide-react';

export function Empty({ text = 'No records yet. Your institute will publish updates here.' }) {
  return (
    <div className="empty">
      <BookOpen size={30} />
      <h3>A fresh start</h3>
      <p>{text}</p>
    </div>
  );
}
