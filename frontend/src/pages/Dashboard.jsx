import { useDashboard } from '../hooks/useDashboard.js';
import React from 'react';
import { ScrollExperience } from '../components/motion/ScrollExperience.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { reveal } from '../constants/motion.js';

import { ArrowRight, Plus, ShieldCheck, Check } from 'lucide-react';

import { Select } from '../components/forms/Select.jsx';
import { Empty } from '../components/common/Empty.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Topbar } from '../components/layout/Topbar.jsx';
import { PageHeading } from '../components/layout/PageHeading.jsx';
import { AcademicModal } from '../components/forms/AcademicModal.jsx';
import { CampusOverview } from './CampusOverview.jsx';
import { StudentOverview } from './StudentOverview.jsx';
import { Examinations } from './Examinations.jsx';
import { AcademicProgress } from './AcademicProgress.jsx';
import { Activities } from './Activities.jsx';
import { Teachers } from './Teachers.jsx';
import { Profile } from './Profile.jsx';
import { Directory } from './Directory.jsx';
import { SettingsPage } from './SettingsPage.jsx';

export function Dashboard({ user, preview, logout }) {
  const {
    staff,
    page,
    setPage,
    data,
    setData,
    users,
    subjects,
    selected,
    setSelected,
    semester,
    setSemester,
    error,
    setError,
    notice,
    setNotice,
    modal,
    setModal,
    busy,
    query,
    setQuery,
    mobile,
    setMobile,
    load,
    rows,
    all,
    graded,
    complete,
    sum,
    attendance,
    pending,
    nav,
    open,
    save,
    editable,
  } = useDashboard({ user, preview });
  return (
    <div className="app-shell">
      <ScrollExperience />
      <Sidebar
        mobile={mobile}
        user={user}
        preview={preview}
        staff={staff}
        nav={nav}
        page={page}
        setPage={setPage}
        setMobile={setMobile}
        setNotice={setNotice}
        pending={pending}
        logout={logout}
        setError={setError}
      />
      <div className="workspace">
        <Topbar mobile={mobile} setMobile={setMobile} page={page} preview={preview} />
        <motion.main key={page} variants={reveal} initial="hidden" animate="visible">
          {preview && (
            <div className="preview-banner">
              <span>
                <strong>You’re exploring EduRadar.</strong> This is a read-only demo with sample
                academic records.
              </span>
              <button onClick={logout}>
                Create your campus <ArrowRight size={14} />
              </button>
            </div>
          )}
          <PageHeading
            staff={staff}
            page={page}
            user={user}
            semester={semester}
            setSemester={setSemester}
            all={all}
          />
          {error && !modal && (
            <div className="error" role="alert">
              {error}
              <button className="text-btn" onClick={load}>
                Try again
              </button>
            </div>
          )}
          {notice && (
            <div className="success" role="status">
              <Check size={16} />
              {notice}
            </div>
          )}
          {staff && !['Students', 'Faculty', 'Subjects', 'Settings'].includes(page) && (
            <div className="staff-toolbar">
              <Select
                label="Student record"
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setData(null);
                }}
              >
                <option value="">Select a student to view records</option>
                {users
                  .filter((u) => u.role === 'student')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.identifier} · {u.name}
                    </option>
                  ))}
              </Select>
              {selected && (
                <button
                  className="primary"
                  onClick={() => open(page === 'Activities' ? 'event' : 'record')}
                >
                  <Plus size={16} />
                  {page === 'Activities' ? 'Add activity' : 'Update academic record'}
                </button>
              )}
            </div>
          )}
          <CampusOverview
            staff={staff}
            page={page}
            selected={selected}
            users={users}
            subjects={subjects}
            user={user}
            open={open}
          />
          <StudentOverview
            page={page}
            data={data}
            complete={complete}
            sum={sum}
            attendance={attendance}
            pending={pending}
            rows={rows}
            setPage={setPage}
          />
          <Examinations
            page={page}
            data={data}
            complete={complete}
            semester={semester}
            graded={graded}
            rows={rows}
          />
          <AcademicProgress page={page} data={data} semester={semester} rows={rows} />
          <Activities page={page} data={data} />
          <Teachers page={page} data={data} rows={rows} />
          <Profile page={page} data={data} user={user} />
          <Directory
            page={page}
            user={user}
            open={open}
            query={query}
            setQuery={setQuery}
            subjects={subjects}
            users={users}
            setSelected={setSelected}
            setPage={setPage}
          />
          <SettingsPage page={page} preview={preview} open={open} />
          {staff &&
            !selected &&
            ['Examinations', 'Attendance', 'Assignments', 'Practicals', 'Activities'].includes(
              page,
            ) && (
              <section className="panel">
                <Empty text="Select a student above to view or update their records." />
              </section>
            )}
          <footer className="page-footer">
            <span>
              eduradar <i>·</i> A little clarity. A lot of possibility.
            </span>
            <span>
              <ShieldCheck size={13} /> Private to your institute
            </span>
          </footer>
        </motion.main>
      </div>
      <AnimatePresence>
        {modal && (
          <AcademicModal
            key={modal}
            busy={busy}
            setModal={setModal}
            modal={modal}
            save={save}
            users={users}
            editable={editable}
            all={all}
            error={error}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
