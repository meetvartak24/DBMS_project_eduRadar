import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });
import mysql from 'mysql2/promise';

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && (dbUrl.endsWith('/sys') || dbUrl.includes('/sys?') || dbUrl.includes('/sys/'))) {
  dbUrl = dbUrl.replace(/\/sys(?=[\/?]|$)/, '/test');
}

const isTiDB =
  (process.env.DB_HOST || '').includes('tidbcloud.com') ||
  (dbUrl || '').includes('tidbcloud.com');
const useSSL = process.env.DB_SSL === 'true' || isTiDB;

const sslConfig = useSSL
  ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    }
  : undefined;

let dbName = process.env.DB_NAME;
if (!dbName || dbName === 'sys') {
  dbName = isTiDB ? 'test' : 'eduradar';
}

export const options = dbUrl
  ? {
      uri: dbUrl,
      decimalNumbers: true,
      ...(sslConfig ? { ssl: sslConfig } : {}),
    }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || (isTiDB ? 4000 : 3306)),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      decimalNumbers: true,
      ...(sslConfig ? { ssl: sslConfig } : {}),
    };

export const db = mysql.createPool(
  dbUrl
    ? {
        uri: dbUrl,
        decimalNumbers: true,
        ...(sslConfig ? { ssl: sslConfig } : {}),
        connectionLimit: 10,
      }
    : { ...options, connectionLimit: 10 },
);
