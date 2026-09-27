import React from 'react';
import { Settings } from 'lucide-react';
import { Select } from '../forms/Select.jsx';

export function PageHeading({ staff, page, user, semester, setSemester, all }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">
          {staff ? 'YOUR CAMPUS, AT A GLANCE' : 'EVERY STEP FORWARD COUNTS'}
        </span>
        <h1>
          {page === 'Overview'
            ? staff
              ? 'Campus overview'
              : `Hello, ${user.name.split(' ')[0]} 👋`
            : page}
        </h1>
        <p>
          {page === 'Overview'
            ? 'Here’s where things stand. Let’s keep you moving forward.'
            : {
                Examinations: 'Your results, one subject at a time.',
                Attendance: 'Show up today. Build a stronger tomorrow.',
                Assignments: 'Keep track of every submission.',
                Practicals: 'Learning by doing, progress by progress.',
                Activities: 'Your journey beyond the classroom.',
                Teachers: 'The people guiding your academic journey.',
                Students: 'Manage the students in your institute.',
                Faculty: 'Your institute’s teaching team.',
                Subjects: 'Build your curriculum and assign faculty.',
                Profile: 'Your academic identity.',
                Settings: 'Manage your account security.',
              }[page]}
        </p>
      </div>
      {!['Students', 'Faculty', 'Subjects', 'Profile', 'Settings'].includes(page) && (
        <Select
          label="Academic period"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="all">All semesters</option>
          {[...new Set(all.map((r) => r.semester))]
            .sort((a, b) => a - b)
            .map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
        </Select>
      )}
    </div>
  );
}
