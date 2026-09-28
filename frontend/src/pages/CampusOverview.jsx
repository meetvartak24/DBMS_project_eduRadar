import { motion } from 'framer-motion';
import { stagger } from '../constants/motion.js';
import React from 'react';
import { GraduationCap, Users, BookOpen, Plus, Building2 } from 'lucide-react';
import { Stat } from '../components/dashboard/Stat.jsx';

export function CampusOverview({ staff, page, selected, users, subjects, user, open }) {
  return staff && page === 'Overview' && !selected ? (
    <>
      <motion.div className="stats" variants={stagger} initial="hidden" animate="visible">
        <Stat
          label="Students enrolled"
          value={users.filter((u) => u.role === 'student').length}
          icon={Users}
          detail="Within your institute"
        />
        <Stat
          label="Faculty members"
          value={users.filter((u) => u.role === 'faculty').length}
          icon={GraduationCap}
          detail="Your teaching team"
        />
        <Stat
          label="Subjects"
          value={subjects.length}
          icon={BookOpen}
          detail="Across all semesters"
        />
        <Stat
          label="Institute code"
          animateValue={false}
          value={user.institute_code}
          icon={Building2}
          detail="Share with your students"
        />
      </motion.div>
      <section className="panel">
        <h2>Your campus starts here</h2>
        <p className="muted">
          Add faculty and students, create subjects, then select a student above to publish their
          academic records.
        </p>
        {user.role === 'admin' && (
          <div className="actions">
            <button className="primary" onClick={() => open('student')}>
              <Plus size={16} />
              Add student
            </button>
            <button className="secondary" onClick={() => open('faculty')}>
              Add faculty
            </button>
            <button className="secondary" onClick={() => open('subject')}>
              Create subject
            </button>
          </div>
        )}
      </section>
    </>
  ) : null;
}
