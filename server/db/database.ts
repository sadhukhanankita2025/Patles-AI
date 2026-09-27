import { Pool } from 'pg';
import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import fs from 'fs';

const defaultUrl = 'postgresql://postgres@127.0.0.1:5433/postgres';
const connectionString = process.env.DATABASE_URL || defaultUrl;

function isPortOpen(port: number, host: string = '127.0.0.1', timeoutMs: number = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => {
      status = true;
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export async function ensurePostgresDaemon() {
  try {
    const is5433 = connectionString.includes('5433');
    if (!is5433) return;

    const isOpen = await isPortOpen(5433);
    if (isOpen) return;

    const pgDataDir = path.resolve(process.cwd(), 'server', 'db', 'pgdata');
    const postgresExe = 'C:\\Program Files\\PostgreSQL\\18\\bin\\postgres.exe';

    if (fs.existsSync(postgresExe) && fs.existsSync(pgDataDir)) {
      console.log('🔄 Spawning local PostgreSQL 18 daemon on port 5433...');
      const child = spawn(postgresExe, ['-D', pgDataDir, '-p', '5433'], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      // Wait up to 3 seconds for postgres to become available
      for (let i = 0; i < 15; i++) {
        await new Promise((res) => setTimeout(res, 200));
        if (await isPortOpen(5433)) {
          console.log('✅ Local PostgreSQL 18 daemon is now ready on port 5433.');
          break;
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not automatically start local PostgreSQL daemon:', err);
  }
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' && !connectionString.includes('127.0.0.1') && !connectionString.includes('localhost')
    ? { rejectUnauthorized: false }
    : undefined
});

export const requireDatabase = () => {
  return pool;
};
