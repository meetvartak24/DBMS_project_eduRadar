import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Empty } from '../components/common/Empty.jsx';

export function Teachers({ page, data, rows }) {
  const teacherCards = [];
  for (const r of rows || []) {
    if (r.faculties && r.faculties.length > 0) {
      for (const f of r.faculties) {
        teacherCards.push({
          key: `${r.subject_id}-${f.id}`,
          faculty_name: f.name,
          faculty_email: f.email,
          subject_name: r.name,
          semester: r.semester,
        });
      }
    } else {
      teacherCards.push({
        key: String(r.subject_id),
        faculty_name: r.faculty_name || 'Not assigned yet',
        faculty_email: r.faculty_email,
        subject_name: r.name,
        semester: r.semester,
      });
    }
  }

  return (
    page === 'Teachers' &&
    data && (
      <div className="teacher-grid">
        {teacherCards.length ? (
          teacherCards.map((t) => (
            <section className="panel" key={t.key}>
              <div className="teacher-icon">
                <GraduationCap />
              </div>
              <h2>{t.faculty_name}</h2>
              <p>{t.subject_name}</p>
              <span className="tag">Semester {t.semester}</span>
              {t.faculty_email && (
                <a className="email" href={'mailto:' + t.faculty_email}>
                  {t.faculty_email}
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
