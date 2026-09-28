import { motion } from 'framer-motion';
import { stagger } from '../constants/motion.js';
import React from 'react';
import { GraduationCap, ClipboardList, Trophy, BookOpen } from 'lucide-react';

import { gpa } from '../utils/academics.js';
import { Empty } from '../components/common/Empty.jsx';
import { Stat } from '../components/dashboard/Stat.jsx';
import { Results } from '../components/academic/Results.jsx';

export function Examinations({ page, data, complete, semester, graded, rows }) {
  return (
    page === 'Examinations' &&
    data && (
      <>
        <motion.div className="stats" variants={stagger} initial="hidden" animate="visible">
          <Stat
            label="Cumulative GPA"
            value={gpa(complete)}
            suffix="/ 10"
            icon={GraduationCap}
            detail="All completed subject records"
          />
          <Stat
            label={semester === 'all' ? 'Selected-period GPA' : 'Semester GPA'}
            value={gpa(graded)}
            icon={BookOpen}
            detail="Credit-weighted grade points"
          />
          <Stat
            label="Total marks"
            value={graded.reduce((a, r) => a + Number(r.mse) + Number(r.ese), 0)}
            suffix={'/ ' + graded.length * 100}
            icon={ClipboardList}
            detail="Completed results only"
          />
          <Stat
            label="Percentage"
            value={
              graded.length
                ? (
                    graded.reduce((a, r) => a + Number(r.mse) + Number(r.ese), 0) / graded.length
                  ).toFixed(1) + '%'
                : '—'
            }
            icon={Trophy}
            detail="Completed results only"
          />
        </motion.div>
        <section className="panel">
          <h2>Subject-wise results</h2>
          {rows.length ? <Results rows={rows} /> : <Empty />}
          <p className="footnote">
            MSE: 30 marks · ESE: 70 marks. Grade points: 90+ → 10, 80+ → 9, 70+ → 8, 60+ → 7, 50+ →
            6, 40+ → 5, below 40 → 0. GPA is provisional and uses published, complete records.
          </p>
        </section>
      </>
    )
  );
}
