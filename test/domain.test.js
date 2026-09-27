import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { hashPassword, verifyPassword, recordSchema, grade } from '../backend/domain.js';
import { app } from '../backend/app.js';
import { db } from '../backend/db.js';
test('password hashes are salted and verify only the correct password', async () => {
  const hash = await hashPassword('a-secure-password');
  assert.notEqual(hash, await hashPassword('a-secure-password'));
  assert.equal(await verifyPassword('a-secure-password', hash), true);
  assert.equal(await verifyPassword('incorrect', hash), false);
});
test('marks and completion totals reject invalid records', () => {
  const valid = {
    mse: 25,
    ese: 65,
    attended: 30,
    classes: 40,
    assignments: 8,
    submitted: 7,
    practicals: 10,
    completed: 9,
  };
  assert.equal(recordSchema.safeParse(valid).success, true);
  for (const change of [
    { mse: 31 },
    { ese: 71 },
    { attended: 41 },
    { submitted: 9 },
    { completed: 11 },
    { classes: -1 },
    { attended: 2.5 },
  ])
    assert.equal(recordSchema.safeParse({ ...valid, ...change }).success, false);
  assert.equal(recordSchema.safeParse({ ...valid, mse: null, ese: null }).success, true);
});
test('grade boundaries are consistent', () => {
  assert.deepEqual([39, 40, 50, 60, 70, 80, 90, 100].map(grade), [0, 5, 6, 7, 8, 9, 10, 10]);
});
test('protected endpoints reject unauthenticated access', async () => {
  for (const url of ['/api/me', '/api/users', '/api/subjects', '/api/students/1'])
    await request(app).get(url).expect(401);
  await request(app).put('/api/students/1/records/1').send({}).expect(401);
});
test('invalid auth payloads fail before database access', async () => {
  await request(app).post('/api/register').send({}).expect(400);
  await request(app).post('/api/login').send({ role: 'superadmin' }).expect(400);
  await request(app).post('/api/login').type('form').send({}).expect(415);
});
test.after(async () => {
  await db.end();
});
