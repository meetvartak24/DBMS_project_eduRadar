import React from 'react';
import { Check } from 'lucide-react';
import { Field } from './Field.jsx';
import { Select } from './Select.jsx';
import { RecordFields } from './RecordFields.jsx';

export function AcademicModal({ busy, setModal, modal, save, users, editable, all, error }) {
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) setModal(null);
      }}
    >
      <section
        className="modal"
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
                subject: 'Create subject',
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
              <Field label="Subject name" name="name" required />
              <Field label="Subject code" name="code" maxLength={32} required />
              <div className="form-grid">
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
                  label="Credits"
                  name="credits"
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={3}
                  required
                />
              </div>
              <Select label="Assigned faculty" name="faculty_id">
                <option value="">Unassigned</option>
                {users
                  .filter((u) => u.role === 'faculty')
                  .map((u) => (
                    <option value={u.id} key={u.id}>
                      {u.name}
                    </option>
                  ))}
              </Select>
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
      </section>
    </div>
  );
}
