import React from 'react';
import { UserRound } from 'lucide-react';

export function Profile({ page, data, user }) {
  return (
    page === 'Profile' && (
      <section className="panel profile">
        <div className="profile-avatar">
          <UserRound size={40} />
        </div>
        <h2>{(data?.profile || user).name}</h2>
        <span className="tag">{user.institute_name}</span>
        <div className="profile-grid">
          {Object.entries({
            Identifier: (data?.profile || user).identifier,
            Email: (data?.profile || user).email,
            Branch: (data?.profile || user).branch,
            Division: (data?.profile || user).division,
            Semester: (data?.profile || user).semester,
            'Academic year': (data?.profile || user).academic_year,
          }).map(([k, v]) => (
            <div key={k}>
              <small>{k}</small>
              <strong>{v || 'Not set'}</strong>
            </div>
          ))}
        </div>
      </section>
    )
  );
}
