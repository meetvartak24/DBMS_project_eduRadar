import { useEffect, useState, useRef } from 'react';
import { api } from '../services/api.js';
import { pct } from '../utils/academics.js';
import { demo } from '../data/demo.js';

export function useDashboard({ user, preview }) {
  const staff = user.role !== 'student';
  const [page, setPage] = useState('Overview');
  const [data, setData] = useState(preview ? demo : null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [semester, setSemester] = useState('all');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const loadVersion = useRef(0);
  async function load() {
    const version = ++loadVersion.current;
    setError('');
    try {
      if (preview) return;
      const s = await api('/subjects');
      if (version !== loadVersion.current) return;
      setSubjects(s);
      if (staff) {
        const u = await api('/users');
        if (version !== loadVersion.current) return;
        setUsers(u);
        const next = selected ? await api('/students/' + selected) : null;
        if (version === loadVersion.current) setData(next);
      } else {
        const next = await api('/students/' + user.id);
        if (version === loadVersion.current) setData(next);
      }
    } catch (e) {
      if (version === loadVersion.current) setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, [selected]);
  const rows = (data?.records || []).filter(
    (r) => semester === 'all' || String(r.semester) === semester,
  );
  const all = data?.records || [];
  const graded = rows.filter((r) => r.mse !== null && r.ese !== null);
  const complete = all.filter((r) => r.mse !== null && r.ese !== null);

  const sum = (k) => rows.reduce((a, r) => a + Number(r[k]), 0);
  const attendance = pct(sum('attended'), sum('classes'));
  const pending = sum('assignments') - sum('submitted');
  const nav = staff
    ? [
        'Overview',
        'Students',
        'Subjects',
        'Faculty',
        'Examinations',
        'Attendance',
        'Assignments',
        'Practicals',
        'Activities',
        'Settings',
      ]
    : [
        'Overview',
        'Examinations',
        'Attendance',
        'Assignments',
        'Practicals',
        'Activities',
        'Teachers',
        'Profile',
        'Settings',
      ];
  function open(type) {
    setError('');
    setNotice('');
    setEditingSubject(null);
    setModal(type);
  }
  function openEditSubject(subject) {
    setError('');
    setNotice('');
    setEditingSubject(subject);
    setModal('subject');
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const formData = new FormData(e.target);
    const b = Object.fromEntries(formData);
    try {
      if (modal === 'student' || modal === 'faculty') {
        await api('/users', 'POST', { ...b, role: modal, semester: Number(b.semester || 1) });
      } else if (modal === 'subject') {
        const faculty_ids = formData.getAll('faculty_ids').map(Number).filter(Boolean);
        const payload = {
          name: b.name,
          code: b.code,
          semester: Number(b.semester),
          credits: Number(b.credits),
          faculty_ids,
          faculty_id: faculty_ids[0] ?? null,
        };
        if (editingSubject?.id) {
          await api(`/subjects/${editingSubject.id}`, 'PUT', payload);
        } else {
          await api('/subjects', 'POST', payload);
        }
      } else if (modal === 'record') {
        const subjectId = b.subject_id;
        delete b.subject_id;
        for (const k in b) b[k] = (k === 'mse' || k === 'ese') && b[k] === '' ? null : Number(b[k]);
        await api(`/students/${selected}/records/${subjectId}`, 'PUT', b);
      } else if (modal === 'event') {
        await api(`/students/${selected}/events`, 'POST', b);
      } else if (modal === 'password') {
        await api('/password', 'POST', b);
      }
      setModal(null);
      setEditingSubject(null);
      setNotice('Saved successfully.');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const editable = subjects.filter(
    (s) =>
      user.role === 'admin' ||
      s.faculty_id === user.id ||
      (Array.isArray(s.faculty_ids) && s.faculty_ids.includes(user.id)) ||
      (Array.isArray(s.faculties) && s.faculties.some((f) => f.id === user.id)),
  );

  return {
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
    editingSubject,
    setEditingSubject,
    openEditSubject,
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
  };
}
