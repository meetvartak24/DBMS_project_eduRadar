import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Empty } from '../components/common/Empty.jsx';

export function Teachers({ page, data, rows }) {
  return (
    page === 'Teachers' &&
    data && (
      <div className="teacher-grid">
        {rows.length ? (
          rows.map((r) => (
            <section className="panel" key={r.subject_id}>
              <div className="teacher-icon">
                <GraduationCap />
              </div>
              <h2>{r.faculty_name || 'Not assigned yet'}</h2>
              <p>{r.name}</p>
              <span className="tag">Semester {r.semester}</span>
              {r.faculty_email && (
                <a className="email" href={'mailto:' + r.faculty_email}>
                  {r.faculty_email}
                </a>
              )}
            </section>
          ))
        ) : (
          <section className="panel">
            <Empty />
          </section>
        )}
      </div>
    )
  );
}
