import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../backend/app.js';
import { db } from '../backend/db.js';
after(() => db.end());
test('MySQL workflow: publish records and enforce role/tenant isolation', async () => {
  const suffix = Date.now().toString(36);
  const pass = 'Integration-test-password-42';
  const a = request.agent(app);
  const b = request.agent(app);
  const faculty = request.agent(app);
  const unassigned = request.agent(app);
  const student = request.agent(app);
  const codeA = 'TEST-A-' + suffix;
  const codeB = 'TEST-B-' + suffix;
  for (const [client, code] of [
    [a, codeA],
    [b, codeB],
  ])
    await client
      .post('/api/register')
      .send({
        instituteName: 'Integration ' + code,
        code,
        name: 'Test admin',
        email: 'admin@example.test',
        password: pass,
      })
      .expect(201);
  const addUser = async (client, role, identifier) =>
    (
      await client
        .post('/api/users')
        .send({
          name: identifier,
          email: identifier + '@example.test',
          role,
          identifier,
          password: pass,
          semester: 6,
          branch: 'Computer Engineering',
          division: 'B',
          academic_year: '2026-27',
        })
        .expect(201)
    ).body.id;
  const facultyId = await addUser(a, 'faculty', 'FAC1');
  const fac2Id = await addUser(a, 'faculty', 'FAC2');
  const studentA = await addUser(a, 'student', 'ROLL1');
  const studentB = await addUser(b, 'student', 'ROLL1');
  const subjectA = (
    await a
      .post('/api/subjects')
      .send({ name: 'DBMS', code: 'CS601', semester: 6, credits: 3, faculty_id: facultyId })
      .expect(201)
  ).body.id;
  await b
    .post('/api/subjects')
    .send({
      name: 'Illegal assignment',
      code: 'BAD',
      semester: 6,
      credits: 3,
      faculty_id: facultyId,
    })
    .expect(400);
  for (const [client, role, identifier] of [
    [faculty, 'faculty', 'FAC1'],
    [unassigned, 'faculty', 'FAC2'],
    [student, 'student', 'ROLL1'],
  ])
    await client
      .post('/api/login')
      .send({ code: codeA, role, identifier, password: pass })
      .expect(200);
  await request(app)
    .post('/api/login')
    .send({ code: codeA, role: 'student', identifier: 'ROLL1', password: 'wrong-password' })
    .expect(401);
  const record = {
    mse: 23,
    ese: 61,
    attended: 42,
    classes: 48,
    assignments: 10,
    submitted: 9,
    practicals: 12,
    completed: 11,
  };
  await faculty.put(`/api/students/${studentA}/records/${subjectA}`).send(record).expect(200);
  assert.equal(
    (await student.get('/api/students/' + studentA).expect(200)).body.records[0].ese,
    61,
  );
  await student.get('/api/students/' + studentB).expect(403);
  await a.get('/api/students/' + studentB).expect(404);
  await b.put(`/api/students/${studentA}/records/${subjectA}`).send(record).expect(404);
  await b.put(`/api/students/${studentB}/records/${subjectA}`).send(record).expect(404);
  await student.put(`/api/students/${studentA}/records/${subjectA}`).send(record).expect(403);
  await unassigned.put(`/api/students/${studentA}/records/${subjectA}`).send(record).expect(403);
  await a
    .put(`/api/subjects/${subjectA}`)
    .send({
      name: 'DBMS',
      code: 'CS601',
      semester: 6,
      credits: 3,
      faculty_ids: [facultyId, fac2Id],
    })
    .expect(200);
  const subjectsA = (await a.get('/api/subjects').expect(200)).body;
  const currentSubject = subjectsA.find((s) => s.id === subjectA);
  assert.equal(currentSubject.faculties.length, 2);
  assert.deepEqual(currentSubject.faculty_ids.sort(), [facultyId, fac2Id].sort());

  await unassigned
    .put(`/api/students/${studentA}/records/${subjectA}`)
    .send({ ...record, mse: 26 })
    .expect(200);
  const studentData = (await student.get('/api/students/' + studentA).expect(200)).body;
  assert.equal(studentData.records[0].mse, 26);
  assert.equal(studentData.records[0].faculties.length, 2);
  await faculty.post('/api/users').send({}).expect(403);
  await faculty
    .put(`/api/students/${studentA}/records/${subjectA}`)
    .send({ ...record, attended: 49 })
    .expect(400);
  await faculty
    .post(`/api/students/${studentA}/events`)
    .send({
      name: 'Hackathon',
      event_date: '2026-09-01',
      status: 'Winner',
      certificate: 'https://example.test/certificate',
    })
    .expect(201);
  assert.equal((await student.get('/api/students/' + studentA)).body.events.length, 1);
  await student.post('/api/logout').send({}).expect(200);
  await student.get('/api/me').expect(401);
});
