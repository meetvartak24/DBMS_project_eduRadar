import React from 'react';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { Empty } from '../components/common/Empty.jsx';

export function Directory({
  page,
  user,
  open,
  query,
  setQuery,
  subjects,
  users,
  setSelected,
  setPage,
}) {
  return (
    ['Students', 'Faculty', 'Subjects'].includes(page) && (
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>
              {page === 'Subjects'
                ? 'Your curriculum'
                : page === 'Faculty'
                  ? 'Teaching team'
                  : 'Student directory'}
            </h2>
            <p>Only members of {user.institute_name}</p>
          </div>
          {user.role === 'admin' && (
            <button
              className="primary"
              onClick={() =>
                open(page === 'Subjects' ? 'subject' : page === 'Faculty' ? 'faculty' : 'student')
              }
            >
              <Plus size={16} />
              Add {page === 'Subjects' ? 'subject' : page === 'Faculty' ? 'faculty' : 'student'}
            </button>
          )}
        </div>
        <div className="search">
          <Search size={17} />
          <input
            aria-label="Search directory"
            placeholder={'Search ' + page.toLowerCase() + '…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>{page === 'Subjects' ? 'Code' : 'Identifier'}</th>
                <th>{page === 'Subjects' ? 'Semester' : 'Email'}</th>
                <th>{page === 'Subjects' ? 'Faculty' : 'Details'}</th>
              </tr>
            </thead>
            <tbody>
              {(page === 'Subjects'
                ? subjects
                : users.filter((u) => u.role === (page === 'Faculty' ? 'faculty' : 'student'))
              )
                .filter((u) => JSON.stringify(u).toLowerCase().includes(query.toLowerCase()))
                .map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>
                    <td>{u.code || u.identifier}</td>
                    <td>{page === 'Subjects' ? u.semester : u.email}</td>
                    <td>
                      {page === 'Subjects' ? (
                        u.faculty_name || 'Unassigned'
                      ) : page === 'Students' ? (
                        <button
                          className="text-btn"
                          onClick={() => {
                            setSelected(String(u.id));
                            setPage('Overview');
                          }}
                        >
                          View records <ArrowRight size={14} />
                        </button>
                      ) : (
                        'Faculty member'
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!(
          page === 'Subjects'
            ? subjects
            : users.filter((u) => u.role === (page === 'Faculty' ? 'faculty' : 'student'))
        ).length && (
          <Empty
            text={
              'No ' + page.toLowerCase() + ' yet. Your institute administrator can add them here.'
            }
          />
        )}
      </section>
    )
  );
}
