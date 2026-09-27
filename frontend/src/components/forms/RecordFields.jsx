import React from 'react';
import { useState } from 'react';
import { blankRecord } from '../../constants/records.js';
import { Field } from './Field.jsx';
import { Select } from './Select.jsx';

export function RecordFields({ subjects, records }) {
  const [id, setId] = useState(String(subjects[0]?.id || ''));
  const r = records.find((r) => String(r.subject_id) === id) || blankRecord;
  return (
    <>
      <Select
        label="Subject"
        name="subject_id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} · Semester {s.semester}
          </option>
        ))}
      </Select>
      {!subjects.length && (
        <p className="error">
          No subjects are assigned to you. Ask your administrator to create an assigned subject.
        </p>
      )}
      <p className="footnote">
        Leave unpublished marks blank. Saving publishes the record to this student immediately.
      </p>
      <div key={id} className="form-grid">
        {Object.entries({
          mse: 'MSE marks / 30',
          ese: 'ESE marks / 70',
          attended: 'Classes attended',
          classes: 'Total classes',
          submitted: 'Assignments submitted',
          assignments: 'Total assignments',
          completed: 'Practicals submitted',
          practicals: 'Total practicals',
        }).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            name={key}
            type="number"
            min={0}
            max={key === 'mse' ? 30 : key === 'ese' ? 70 : 10000}
            step={['mse', 'ese'].includes(key) ? '0.01' : '1'}
            defaultValue={r[key] ?? ''}
            required={!['mse', 'ese'].includes(key)}
          />
        ))}
      </div>
    </>
  );
}
