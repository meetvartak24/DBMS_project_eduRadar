import { app } from './app.js';
import { db } from './db.js';
import express from 'express';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../frontend/dist', import.meta.url));
app.use(express.static(dist));
app.get('/{*path}', (req, res) => res.sendFile(path.join(dist, 'index.html')));

export async function ensureSchema() {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'institutes'");
    if (tables.length === 0) {
      console.log('Database tables missing. Automatically initializing schema from schema.sql...');
      const schemaSql = await readFile(new URL('../database/schema.sql', import.meta.url), 'utf8');
      const statements = schemaSql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const statement of statements) {
        await db.query(statement);
      }
      console.log('EduRadar database tables initialized successfully!');
    } else {
      console.log('Database schema verified: institutes table exists.');
    }
  } catch (err) {
    console.error('Database auto-initialization notice:', err.message);
  }
}

const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, async () => {
  console.log(`EduRadar API listening on http://${host}:${port}`);
  await ensureSchema();
});
