import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { db } from './db.js';
import { hashPassword, verifyPassword, digest, recordSchema } from './domain.js';
export const app = express();
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !req.is('application/json'))
    return res.status(415).json({ error: 'JSON requests required' });
  next();
});
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});
const str = z.string().trim().min(1).max(120);
const password = z.string().min(10).max(128);
const userSchema = z.object({
  name: str,
  identifier: str,
  email: z.string().email().max(160),
  password,
  role: z.enum(['faculty', 'student']),
  branch: z.string().max(100).default(''),
  division: z.string().max(20).default(''),
  semester: z.number().int().min(1).max(12).default(1),
  academic_year: z.string().max(20).default(''),
});
const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const safeUser = (u) => {
  const { password_hash, ...safe } = u;
  return safe;
};
async function session(res, userId) {
  const token = randomBytes(32).toString('hex');
  await db.execute('INSERT INTO sessions VALUES (?,?,DATE_ADD(NOW(), INTERVAL 8 HOUR))', [
    digest(token),
    userId,
  ]);
  res.cookie('eduradar_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 28800000,
    path: '/',
  });
}
app.get('/api/health', async (req, res) => {
  await db.query('SELECT 1');
  res.json({ status: 'ok' });
});
app.post('/api/register', authLimit, async (req, res) => {
  const b = z
    .object({
      instituteName: z.string().trim().min(2).max(160),
      code: z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9-]{3,32}$/)
        .transform((s) => s.toUpperCase()),
      name: str,
      email: z.string().email().max(160),
      password,
    })
    .parse(req.body);
  const hash = await hashPassword(b.password);
  const c = await db.getConnection();
  let id;
  try {
    await c.beginTransaction();
    const [i] = await c.execute('INSERT INTO institutes(name,code) VALUES (?,?)', [
      b.instituteName,
      b.code,
    ]);
    const [u] = await c.execute(
      "INSERT INTO users(institute_id,role,name,identifier,email,password_hash) VALUES (?,'admin',?,?,?,?)",
      [i.insertId, b.name, b.email.toLowerCase(), b.email, hash],
    );
    id = u.insertId;
    await c.commit();
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
  await session(res, id);
  res.status(201).json({ ok: true });
});
app.post('/api/login', authLimit, async (req, res) => {
  const b = z
    .object({
      code: str,
      identifier: str,
      password: z.string().min(1).max(128),
      role: z.enum(['admin', 'faculty', 'student']),
    })
    .parse(req.body);
  const [rows] = await db.execute(
    'SELECT u.* FROM users u JOIN institutes i ON i.id=u.institute_id WHERE i.code=? AND u.identifier=? AND u.role=?',
    [b.code.toUpperCase(), b.identifier, b.role],
  );
  const u = rows[0];
  if (!u || !(await verifyPassword(b.password, u.password_hash)))
    fail(401, 'Institute code, credentials or account type is incorrect.');
  await session(res, u.id);
  res.json({ ok: true });
});
app.use('/api', async (req, res, next) => {
  const token = req.headers.cookie
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith('eduradar_session='))
    ?.slice(17);
  if (!token) fail(401, 'Please sign in.');
  const [rows] = await db.execute(
    'SELECT u.*,i.name institute_name,i.code institute_code FROM sessions s JOIN users u ON u.id=s.user_id JOIN institutes i ON i.id=u.institute_id WHERE s.token_hash=? AND s.expires_at>NOW()',
    [digest(token)],
  );
  if (!rows[0]) fail(401, 'Your session expired. Please sign in.');
  req.user = rows[0];
  req.sessionHash = digest(token);
  next();
});
app.get('/api/me', (req, res) => res.json(safeUser(req.user)));
app.post('/api/logout', async (req, res) => {
  await db.execute('DELETE FROM sessions WHERE token_hash=?', [req.sessionHash]);
  res.clearCookie('eduradar_session', { path: '/' });
  res.json({ ok: true });
});
app.post('/api/password', async (req, res) => {
  const b = z.object({ current: z.string().max(128), password }).parse(req.body);
  if (!(await verifyPassword(b.current, req.user.password_hash)))
    fail(400, 'Current password is incorrect');
  await db.execute('UPDATE users SET password_hash=? WHERE id=?', [
    await hashPassword(b.password),
    req.user.id,
  ]);
  await db.execute('DELETE FROM sessions WHERE user_id=?', [req.user.id]);
  await session(res, req.user.id);
  res.json({ ok: true });
});
const staff = (req, res, next) => {
  if (req.user.role === 'student') fail(403, 'Faculty access required');
  next();
};
const admin = (req, res, next) => {
  if (req.user.role !== 'admin') fail(403, 'Administrator access required');
  next();
};
app.get('/api/users', staff, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id,name,identifier,email,role,branch,division,semester,academic_year FROM users WHERE institute_id=? ORDER BY name',
    [req.user.institute_id],
  );
  res.json(rows);
});
app.post('/api/users', admin, async (req, res) => {
  const b = userSchema.parse(req.body);
  const [r] = await db.execute(
    'INSERT INTO users(institute_id,role,name,identifier,email,password_hash,branch,division,semester,academic_year) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [
      req.user.institute_id,
      b.role,
      b.name,
      b.identifier,
      b.email,
      await hashPassword(b.password),
      b.branch,
      b.division,
      b.semester,
      b.academic_year,
    ],
  );
  res.status(201).json({ id: r.insertId });
});
app.get('/api/subjects', async (req, res) => {
  const [rows] = await db.execute(
    'SELECT s.*,u.name faculty_name,u.email faculty_email FROM subjects s LEFT JOIN users u ON u.id=s.faculty_id AND u.institute_id=s.institute_id WHERE s.institute_id=? ORDER BY s.semester,s.name',
    [req.user.institute_id],
  );
  res.json(rows);
});
app.post('/api/subjects', admin, async (req, res) => {
  const b = z
    .object({
      name: str,
      code: z.string().trim().min(1).max(32),
      semester: z.number().int().min(1).max(12),
      credits: z.number().int().min(1).max(10),
      faculty_id: z.number().int().positive().nullable(),
    })
    .parse(req.body);
  if (b.faculty_id) {
    const [f] = await db.execute(
      "SELECT id FROM users WHERE id=? AND institute_id=? AND role='faculty'",
      [b.faculty_id, req.user.institute_id],
    );
    if (!f.length) fail(400, 'Select a faculty member from this institute');
  }
  const [r] = await db.execute(
    'INSERT INTO subjects(institute_id,name,code,semester,credits,faculty_id) VALUES (?,?,?,?,?,?)',
    [req.user.institute_id, b.name, b.code, b.semester, b.credits, b.faculty_id],
  );
  res.status(201).json({ id: r.insertId });
});
async function student(req, id) {
  if (req.user.role === 'student' && req.user.id !== Number(id))
    fail(403, 'You can only view your own records');
  const [rows] = await db.execute(
    "SELECT id,name,identifier,branch,division,semester,academic_year,email FROM users WHERE institute_id=? AND id=? AND role='student'",
    [req.user.institute_id, id],
  );
  if (!rows[0]) fail(404, 'Student not found');
  return rows[0];
}
app.get('/api/students/:id', async (req, res) => {
  const profile = await student(req, req.params.id);
  const [records] = await db.execute(
    'SELECT r.*,s.name,s.code,s.semester,s.credits,u.name faculty_name,u.email faculty_email FROM records r JOIN subjects s ON s.id=r.subject_id AND s.institute_id=r.institute_id LEFT JOIN users u ON u.id=s.faculty_id WHERE r.institute_id=? AND r.student_id=? ORDER BY s.semester,s.name',
    [req.user.institute_id, profile.id],
  );
  const [events] = await db.execute(
    'SELECT * FROM events WHERE institute_id=? AND student_id=? ORDER BY event_date DESC',
    [req.user.institute_id, profile.id],
  );
  res.json({ profile, records, events });
});
app.put('/api/students/:id/records/:subjectId', staff, async (req, res) => {
  await student(req, req.params.id);
  const b = recordSchema.parse(req.body);
  const [subjects] = await db.execute('SELECT * FROM subjects WHERE institute_id=? AND id=?', [
    req.user.institute_id,
    req.params.subjectId,
  ]);
  const subject = subjects[0];
  if (!subject) fail(404, 'Subject not found');
  if (req.user.role === 'faculty' && subject.faculty_id !== req.user.id)
    fail(403, 'You can only update subjects assigned to you');
  const c = await db.getConnection();
  try {
    await c.beginTransaction();
    await c.execute(
      'INSERT INTO records(institute_id,student_id,subject_id,mse,ese,attended,classes,assignments,submitted,practicals,completed) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE mse=VALUES(mse),ese=VALUES(ese),attended=VALUES(attended),classes=VALUES(classes),assignments=VALUES(assignments),submitted=VALUES(submitted),practicals=VALUES(practicals),completed=VALUES(completed)',
      [
        req.user.institute_id,
        req.params.id,
        subject.id,
        b.mse,
        b.ese,
        b.attended,
        b.classes,
        b.assignments,
        b.submitted,
        b.practicals,
        b.completed,
      ],
    );
    await c.execute(
      'INSERT INTO audit_log(institute_id,actor_id,student_id,subject_id,details) VALUES (?,?,?,?,?)',
      [req.user.institute_id, req.user.id, req.params.id, subject.id, JSON.stringify(b)],
    );
    await c.commit();
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
  res.json({ ok: true });
});
app.post('/api/students/:id/events', staff, async (req, res) => {
  await student(req, req.params.id);
  const b = z
    .object({
      name: z.string().trim().min(1).max(160),
      event_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((s) => !isNaN(Date.parse(s)), 'Invalid date'),
      status: z.string().trim().min(1).max(80),
      certificate: z
        .string()
        .max(500)
        .refine((s) => !s || /^https:\/\//i.test(s), 'Certificate must be an HTTPS URL')
        .default(''),
    })
    .parse(req.body);
  await db.execute(
    'INSERT INTO events(institute_id,student_id,name,event_date,status,certificate) VALUES (?,?,?,?,?,?)',
    [req.user.institute_id, req.params.id, b.name, b.event_date, b.status, b.certificate],
  );
  res.status(201).json({ ok: true });
});
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError)
    return res
      .status(400)
      .json({ error: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') });
  if (err.code === 'ER_DUP_ENTRY')
    return res
      .status(409)
      .json({ error: 'This institute code or account/subject identifier already exists.' });
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error(err.code || err.message);
  res.status(500).json({
    error: 'Unable to complete the request. Check the database connection and try again.',
  });
});
