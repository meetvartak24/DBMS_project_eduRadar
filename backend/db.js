import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });
import mysql from 'mysql2/promise';

const isTiDB =
  (process.env.DB_HOST || '').includes('tidbcloud.com') ||
  (process.env.DATABASE_URL || '').includes('tidbcloud.com');
const useSSL = process.env.DB_SSL === 'true' || isTiDB;

const sslConfig = useSSL
  ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    }
  : undefined;

export const options = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      decimalNumbers: true,
      ...(sslConfig ? { ssl: sslConfig } : {}),
    }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || (isTiDB ? 4000 : 3306)),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || (isTiDB ? 'test' : 'eduradar'),
      decimalNumbers: true,
      ...(sslConfig ? { ssl: sslConfig } : {}),
    };

export const db = mysql.createPool(
  process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        decimalNumbers: true,
        ...(sslConfig ? { ssl: sslConfig } : {}),
        connectionLimit: 10,
      }
    : { ...options, connectionLimit: 10 },
);
