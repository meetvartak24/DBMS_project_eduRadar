import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { icons } from '../../constants/navigation.js';
import { Logo } from '../common/Logo.jsx';

export function Sidebar({
  mobile,
  user,
  preview,
  staff,
  nav,
  page,
  setPage,
  setMobile,
  setNotice,
  pending,
  logout,
  setError,
}) {
  return (
    <aside className={mobile ? 'sidebar mobile-open' : 'sidebar'}>
      <Logo />
      <div className="campus">
        <span className="campus-icon">
          <Building2 size={19} />
        </span>
        <div>
          <strong>{user.institute_name}</strong>
          <small>{preview ? 'Demo campus' : user.institute_code}</small>
        </div>
      </div>
      <div className="nav-label">{staff ? 'CAMPUS WORKSPACE' : 'STUDENT WORKSPACE'}</div>
      <nav>
        {nav.map((n) => {
          const Icon = icons[n];
          return (
            <button
              key={n}
              className={page === n ? 'active' : ''}
              aria-current={page === n ? 'page' : undefined}
              onClick={() => {
                setPage(n);
                setMobile(false);
                setNotice('');
              }}
            >
              {page === n && (
                <motion.span
                  className="nav-highlight"
                  layoutId="sidebar-active-page"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <Icon size={19} />
              <span className="nav-text">{n}</span>
              {n === 'Assignments' && pending > 0 && <b>{pending}</b>}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="private-note">
          <ShieldCheck size={20} />
          <strong>Your campus. Your space.</strong>
          <p>Academic information, securely connected.</p>
        </div>
        <button
          className="user-menu"
          onClick={() => {
            setPage('Profile');
            setMobile(false);
          }}
        >
          <span className="avatar">
            {user.name
              .split(' ')
              .map((s) => s[0])
              .slice(0, 2)
              .join('')}
          </span>
          <span>
            <strong>{user.name}</strong>
            <small>{user.role === 'student' ? user.identifier : user.role + ' account'}</small>
          </span>
        </button>
        <button className="signout" onClick={() => logout().catch((e) => setError(e.message))}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
