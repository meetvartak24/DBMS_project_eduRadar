import React from 'react';
import { points } from '../../utils/academics.js';

export function Results({ rows }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>
              MSE <small>/30</small>
            </th>
            <th>
              ESE <small>/70</small>
            </th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const total = r.mse !== null && r.ese !== null ? Number(r.mse) + Number(r.ese) : null;
            const gp = total === null ? null : points(total);
            return (
              <tr key={r.subject_id}>
                <td>
                  <strong>{r.name}</strong>
                  <small>
                    {r.code} · Semester {r.semester}
                  </small>
                </td>
                <td>{r.mse ?? '—'}</td>
                <td>{r.ese ?? '—'}</td>
                <td>
                  <strong>{total ?? '—'}</strong>
                  <span className="out-of"> / 100</span>
                </td>
                <td>
                  <span className={'grade ' + (gp === 0 ? 'fail' : '')}>
                    {gp === null
                      ? 'Pending'
                      : { 10: 'O', 9: 'A+', 8: 'A', 7: 'B+', 6: 'B', 5: 'C', 0: 'F' }[gp]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
