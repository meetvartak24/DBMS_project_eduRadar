import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Field } from './Field.jsx';
import { Select } from './Select.jsx';
import { RecordFields } from './RecordFields.jsx';

export function AcademicModal({
  busy,
  setModal,
  modal,
  save,
  users,
  editable,
  all,
  error,
  editingSubject,
}) {
  const [selectedFacultyIds, setSelectedFacultyIds] = React.useState(() => {
    if (editingSubject?.faculty_ids?.length) return [...editingSubject.faculty_ids];
    if (editingSubject?.faculties?.length) return editingSubject.faculties.map((f) => f.id);
    if (editingSubject?.faculty_id) return [editingSubject.faculty_id];
    return [];
  });

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) setModal(null);
      }}
    >
      <motion.section
        className="modal"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        role="dialog"
        aria-modal="true"
        aria-label="Update campus information"
      >
        <div className="panel-head">
          <h2>
            {
              {
                student: 'Add student',
                faculty: 'Add faculty',
                subject: editingSubject ? 'Edit subject' : 'Create subject',
                record: 'Update academic record',
                event: 'Add activity',
                password: 'Change password',
              }[modal]
            }
          </h2>
          <button className="secondary" disabled={busy} onClick={() => setModal(null)}>
            Close
          </button>
        </div>
        <form onSubmit={save}>
          {['student', 'faculty'].includes(modal) && (
            <>
              <Field label="Full name" name="name" required />
              <Field
                label={modal === 'student' ? 'College roll number' : 'Faculty sign-in ID'}
                name="identifier"
                required
              />
              <Field label="Email" type="email" name="email" required />
              <Field
                label="Initial password (share privately)"
                type="password"
                name="password"
                minLength={10}
                maxLength={128}
                required
              />
              {modal === 'student' && (
                <div className="form-grid">
                  <Field label="Branch" name="branch" required />
                  <Field label="Division" name="division" required />
                  <Field
                    label="Semester"
                    name="semester"
                    type="number"
                    min={1}
                    max={12}
                    defaultValue={1}
                    required
                  />
                  <Field
                    label="Academic year"
                    name="academic_year"
                    placeholder="2026–27"
                    required
                  />
                </div>
              )}
            </>
          )}
          {modal === 'subject' && (
            <>
              <Field
                label="Subject name"
                name="name"
                defaultValue={editingSubject?.name || ''}
                required
              />
              <Field
                label="Subject code"
                name="code"
                maxLength={32}
                defaultValue={editingSubject?.code || ''}
                required
              />
              <div className="form-grid">
                <Field
                  label="Semester"
                  name="semester"
                  type="number"
                  min={1}
                  max={12}
                  defaultValue={editingSubject?.semester || 1}
                  required
                />
                <Field
                  label="Credits"
                  name="credits"
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={editingSubject?.credits || 3}
                  required
                />
              </div>
              <div className="field">
                <label>Assigned faculty</label>
                <div className="faculty-checklist">
                  {users
                    .filter((u) => u.role === 'faculty')
                    .map((u) => {
                      const checked = selectedFacultyIds.includes(u.id);
                      return (
                        <label
                          key={u.id}
                          className={'faculty-check-item' + (checked ? ' checked' : '')}
                        >
                          <input
                            type="checkbox"
                            name="faculty_ids"
                            value={u.id}
                            checked={checked}
                            onChange={() => {
                              setSelectedFacultyIds((prev) =>
                                prev.includes(u.id)
                                  ? prev.filter((id) => id !== u.id)
                                  : [...prev, u.id],
                              );
                            }}
                          />
                          <span className="faculty-check-text">
                            <strong>{u.name}</strong>
                            <small>{u.email || u.identifier}</small>
                          </span>
                        </label>
                      );
                    })}
                  {!users.some((u) => u.role === 'faculty') && (
                    <p className="footnote">No faculty members found. Add faculty first.</p>
                  )}
                </div>
                <small className="muted">
                  Select one or more faculty members to assign to this subject.
                </small>
              </div>
            </>
          )}
          {modal === 'record' && <RecordFields subjects={editable} records={all} />}
          {modal === 'event' && (
            <>
              <Field label="Event name" name="name" required />
              <Field label="Date" type="date" name="event_date" required />
              <Field
                label="Status / position"
                name="status"
                placeholder="Participated, winner, second place…"
                required
              />
              <Field
                label="Certificate link (optional HTTPS URL)"
                type="url"
                name="certificate"
                pattern="https://.*"
              />
            </>
          )}
          {modal === 'password' && (
            <>
              <Field label="Current password" type="password" name="current" required />
              <Field
                label="New password"
                type="password"
                name="password"
                minLength={10}
                maxLength={128}
                required
              />
            </>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary full"
            disabled={busy || (modal === 'record' && !editable.length)}
          >
            {busy ? 'Saving…' : 'Save changes'}
            <Check size={16} />
          </button>
        </form>
      </motion.section>
    </motion.div>
  );
}
