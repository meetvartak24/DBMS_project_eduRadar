import React from 'react';
import { pct } from '../utils/academics.js';
import { Empty } from '../components/common/Empty.jsx';

export function AcademicProgress({ page, data, semester, rows }) {
  return (
    ['Attendance', 'Assignments', 'Practicals'].includes(page) &&
    data && (
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>{page === 'Attendance' ? 'Subject-wise attendance' : page + ' progress'}</h2>
            <p>{semester === 'all' ? 'Across all recorded semesters' : 'Semester ' + semester}</p>
          </div>
        </div>
        {rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>{page === 'Attendance' ? 'Attended' : 'Submitted'}</th>
                  <th>Total</th>
                  <th>{page === 'Attendance' ? 'Attendance' : 'Progress'}</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const a =
                    r[
                      page === 'Attendance'
                        ? 'attended'
                        : page === 'Assignments'
                          ? 'submitted'
                          : 'completed'
                    ];
                  const b =
                    r[
                      page === 'Attendance'
                        ? 'classes'
                        : page === 'Assignments'
                          ? 'assignments'
                          : 'practicals'
                    ];
                  return (
                    <tr key={r.subject_id}>
                      <td>
                        <strong>{r.name}</strong>
                        <small>{r.code}</small>
                      </td>
                      <td>{r.semester}</td>
                      <td>{a}</td>
                      <td>{b}</td>
                      <td>
                        <div className="progress">
                          <i style={{ width: pct(a, b) + '%' }} />
                        </div>
                        {b ? pct(a, b) + '%' : '—'}
                      </td>
                      <td>
                        <span
                          className={
                            'tag ' +
                            (b && (page === 'Attendance' ? pct(a, b) < 75 : a < b) ? 'amber' : '')
                          }
                        >
                          {!b
                            ? 'No records'
                            : page === 'Attendance'
                              ? pct(a, b) >= 75
                                ? 'On track'
                                : 'Below 75%'
                              : b - a
                                ? `${b - a} pending`
                                : 'Complete'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty />
        )}
      </section>
    )
  );
}
