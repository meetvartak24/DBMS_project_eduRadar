import { app } from './app.js';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = fileURLToPath(new URL('../frontend/dist', import.meta.url));
app.use(express.static(dist));
app.get('/{*path}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
app.listen(process.env.PORT || 4000, '127.0.0.1', () =>
  console.log('EduRadar API listening on http://127.0.0.1:' + (process.env.PORT || 4000)),
);
