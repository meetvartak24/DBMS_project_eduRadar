import { ScrollReveal } from '../components/motion/ScrollReveal.jsx';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner.jsx';
import { AttendanceRing } from '../components/dashboard/AttendanceRing.jsx';
import { motion } from 'framer-motion';
import { stagger } from '../constants/motion.js';
import React from 'react';
import {
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Trophy,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { gpa } from '../utils/academics.js';
import { Empty } from '../components/common/Empty.jsx';
import { Stat } from '../components/dashboard/Stat.jsx';
import { Results } from '../components/academic/Results.jsx';

export function StudentOverview({ page, data, complete, sum, attendance, pending, rows, setPage }) {
  return (
    page === 'Overview' &&
    data && (
      <>
        <WelcomeBanner profile={data.profile} />
        <motion.div
          className="stats"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Stat
            label="Cumulative GPA"
            value={gpa(complete)}
            suffix="/ 10"
            icon={GraduationCap}
            detail="Credit-weighted · graded subjects"
          />
          <Stat
            label="Overall attendance"
            value={sum('classes') ? attendance + '%' : '—'}
            icon={CalendarCheck}
            detail={
              sum('classes')
                ? `${sum('attended')} of ${sum('classes')} classes attended`
                : 'Awaiting attendance records'
            }
          />
          <Stat
            label="Assignments submitted"
            value={sum('submitted')}
            suffix={'/ ' + sum('assignments')}
            icon={ClipboardList}
            detail={pending ? `${pending} assignments to catch up on` : 'You’re all caught up'}
          />
          <Stat
            label="Activities & achievements"
            value={data.events.length.toString().padStart(2, '0')}
            icon={Trophy}
            detail="Learning beyond the classroom"
          />
        </motion.div>
        <div className="dashboard-grid">
          <ScrollReveal className="panel">
            <div className="panel-head">
              <div>
                <h2>Academic performance</h2>
                <p>A snapshot of your subject-wise results</p>
              </div>
              <button className="text-btn" onClick={() => setPage('Examinations')}>
                View results <ArrowUpRight size={15} />
              </button>
            </div>
            {rows.length ? <Results rows={rows} /> : <Empty />}
            <div className="panel-foot">
              <span className="dot" /> Marks are published by your institute’s faculty.
            </div>
          </ScrollReveal>
          <ScrollReveal className="panel attendance-panel">
            <div className="panel-head">
              <div>
                <h2>Showing up matters</h2>
                <p>Your overall attendance</p>
              </div>
              <CalendarCheck size={19} />
            </div>
            <AttendanceRing attendance={attendance} hasRecords={sum('classes') > 0} />
            <span className="good-tag">
              {sum('classes')
                ? attendance >= 75
                  ? 'Looking good!'
                  : 'Let’s build consistency'
                : 'Waiting for records'}
            </span>
            <p className="ring-note">
              {sum('classes')
                ? 'Every class is a step closer to your goals.'
                : 'Your attendance will appear here.'}
            </p>
            <button className="secondary full" onClick={() => setPage('Attendance')}>
              Subject breakdown <ArrowRight size={16} />
            </button>
          </ScrollReveal>
          <ScrollReveal className="panel">
            <div className="panel-head">
              <div>
                <h2>A little focus goes a long way</h2>
                <p>Your submission checklist</p>
              </div>
              <ClipboardList size={19} />
            </div>
            {rows.length ? (
              rows.slice(0, 4).map((r) => (
                <div className="checklist" key={r.subject_id}>
                  <span className={'check-icon ' + (r.submitted === r.assignments ? 'done' : '')}>
                    <ClipboardList size={17} />
                  </span>
                  <div>
                    <strong>{r.name}</strong>
                    <small>
                      {r.submitted} of {r.assignments} assignments submitted
                    </small>
                  </div>
                  <span className={r.submitted === r.assignments ? 'tag' : 'tag amber'}>
                    {r.assignments - r.submitted
                      ? `${r.assignments - r.submitted} pending`
                      : 'Complete'}
                  </span>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </ScrollReveal>
          <ScrollReveal className="panel achievements">
            <div className="panel-head">
              <div>
                <h2>Beyond the books</h2>
                <p>Experiences that make you, you.</p>
              </div>
              <Trophy size={19} />
            </div>
            {data.events.length ? (
              data.events.slice(0, 3).map((e) => (
                <div className="event" key={e.id}>
                  <span className="event-icon">
                    <Trophy size={20} />
                  </span>
                  <div>
                    <strong>{e.name}</strong>
                    <small>
                      {new Date(e.event_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </small>
                    <span className="tag">{e.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <Empty text="Your activities and achievements will appear here." />
            )}
            <button className="text-btn" onClick={() => setPage('Activities')}>
              Explore activities <ArrowUpRight size={15} />
            </button>
          </ScrollReveal>
        </div>
      </>
    )
  );
}
