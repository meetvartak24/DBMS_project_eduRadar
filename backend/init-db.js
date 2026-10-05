import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import { options, db } from './db.js';
if (!/^[a-zA-Z0-9_]+$/.test(options.database)) throw Error('Invalid database name');
const connection = await mysql.createConnection({
  ...options,
  database: undefined,
  multipleStatements: true,
});
try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${options.database}\``);
  await connection.changeUser({ database: options.database });
  await connection.query(
    await readFile(new URL('../database/schema.sql', import.meta.url), 'utf8'),
  );
  await connection.query(
    'INSERT IGNORE INTO subject_faculties (institute_id, subject_id, faculty_id) SELECT institute_id, id, faculty_id FROM subjects WHERE faculty_id IS NOT NULL',
  );
  console.log('EduRadar database initialized.');
} finally {
  await connection.end();
  await db.end();
}
