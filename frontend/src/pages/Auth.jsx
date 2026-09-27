import React from 'react';
import { useState } from 'react';
import {
  Radar,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { api } from '../services/api.js';

import { Logo } from '../components/common/Logo.jsx';
import { Field } from '../components/forms/Field.jsx';

export function Auth({ onLogin, onPreview }) {
  const [register, setRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const b = Object.fromEntries(new FormData(e.target));
    try {
      await api(register ? '/register' : '/login', 'POST', register ? b : { ...b, role });
      await onLogin();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth">
      <section className="auth-story">
        <Logo />
        <div className="story-copy">
          <span className="eyebrow">YOUR ACADEMIC COMPASS</span>
          <h1>
            A clearer view.
            <br />A brighter future.
          </h1>
          <p>
            Your progress, achievements, and next steps.
            <br />
            One connected home for your college journey.
          </p>
          <div className="radar-art">
            <div />
            <div />
            <div />
            <Radar size={145} />
            <span className="floating a">
              <Check size={17} /> Every milestone matters
            </span>
            <span className="floating b">
              <GraduationCap size={21} /> Built for your next chapter
            </span>
          </div>
        </div>
        <footer>
          <ShieldCheck size={16} /> One platform. Your own campus.
        </footer>
      </section>
      <section className="auth-form">
        <div className="auth-top">
          {register ? 'Already part of a campus?' : 'Bring your campus together.'}{' '}
          <button
            className="text-btn"
            onClick={() => {
              setRegister(!register);
              setError('');
            }}
          >
            {register ? 'Sign in' : 'Register institute'} <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="form-wrap">
          <span className="small-badge">
            <Building2 size={14} /> THE CONNECTED CAMPUS
          </span>
          <h2>{register ? 'Welcome, institutes.' : 'Welcome back.'}</h2>
          <p className="muted">
            {register
              ? 'Create your institute’s private academic workspace.'
              : 'A little clarity for everything ahead.'}
          </p>
          {!register && (
            <div className="role-tabs">
              {['student', 'faculty', 'admin'].map((r) => (
                <button key={r} className={role === r ? 'selected' : ''} onClick={() => setRole(r)}>
                  {r === 'admin' ? 'Institute admin' : r}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={submit}>
            {register && (
              <>
                <Field
                  label="Institute name"
                  name="instituteName"
                  placeholder="Your college or university"
                  required
                  maxLength={160}
                />
                <Field label="Your name" name="name" required />
              </>
            )}
            <Field
              label="Institute code"
              name="code"
              placeholder="e.g. WESTBRIDGE"
              required
              pattern="[A-Za-z0-9-]{3,32}"
              maxLength={32}
            />
            {register ? (
              <Field label="Administrator email" type="email" name="email" required />
            ) : (
              <Field
                label={
                  role === 'student'
                    ? 'College roll number'
                    : role === 'admin'
                      ? 'Administrator email'
                      : 'Faculty ID'
                }
                name="identifier"
                placeholder={
                  role === 'student' ? 'Enter your roll number' : 'Enter your sign-in ID'
                }
                required
              />
            )}
            <Field
              label="Password"
              type="password"
              name="password"
              placeholder={register ? 'At least 10 characters' : 'Enter your password'}
              minLength={register ? 10 : 1}
              maxLength={128}
              autoComplete={register ? 'new-password' : 'current-password'}
              required
            />
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="primary full" disabled={busy}>
              {busy ? 'Please wait…' : register ? 'Create institute' : 'Sign in to your campus'}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-note">
            {register
              ? 'You’ll be the administrator. Add faculty, subjects, and student accounts once you’re in.'
              : 'Use the credentials provided by your college. Contact your institute administrator if you need help signing in.'}
          </p>
          <div className="divider">
            <span>TAKE A LOOK AROUND</span>
          </div>
          <button className="secondary full" onClick={onPreview}>
            Explore the student demo <ArrowUpRight size={16} />
          </button>
          <p className="demo-note">Sample data · No account needed</p>
        </div>
        <footer>Made for students. Connected by institutions.</footer>
      </section>
    </div>
  );
}
