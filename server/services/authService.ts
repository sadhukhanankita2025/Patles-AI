import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { requireDatabase, ensurePostgresDaemon } from '../db/database.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google' | 'github';
  created_at?: string;
}

const getJwtSecret = (): string => {
  const value = process.env.JWT_SECRET;
  if (value && value.trim().length >= 16) {
    return value.trim();
  }
  return 'patles_ai_jwt_production_ready_secret_key_9847291847192';
};

const userFromRow = (row: any): AuthUser => ({
  id: String(row.id),
  email: row.email,
  name: row.name || row.email.split('@')[0],
  provider: row.provider || 'email',
  created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
});

export const authService = {
  async initialize() {
    await ensurePostgresDaemon();
    const db = requireDatabase();

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL DEFAULT 'Developer',
        provider VARCHAR(20) NOT NULL DEFAULT 'email',
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Ensure sample/dummy pre-seeded credentials for immediate out-of-the-box testing
    await authService.seedDefaultUsers();
  },

  async seedDefaultUsers() {
    await ensurePostgresDaemon();
    const db = requireDatabase();
    const seedEmail = 'testuser@example.com';
    const seedPassword = 'Password123!';
    const seedName = 'Demo Developer';

    const passwordHash = await bcrypt.hash(seedPassword, 10);
    await db.query(`
      INSERT INTO users (email, password_hash, name, provider)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
    `, [seedEmail, passwordHash, seedName, 'email']);
    console.log(`🌱 Pre-seeded demonstration user: ${seedEmail} (Password: ${seedPassword})`);
  },

  async register(email: string, password: string, name?: string) {
    await ensurePostgresDaemon();
    const db = requireDatabase();

    if (!email || typeof email !== 'string') {
      throw new Error('Email is required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount && existing.rowCount > 0) {
      throw new Error('An account already exists with this email address.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const displayName = (name && name.trim()) || normalizedEmail.split('@')[0] || 'Developer';

    try {
      const result = await db.query(
        'INSERT INTO users (email, password_hash, name, provider) VALUES ($1, $2, $3, $4) RETURNING id, email, name, provider, created_at',
        [normalizedEmail, passwordHash, displayName, 'email']
      );

      const user = userFromRow(result.rows[0]);
      const token = this.createSession(user);
      return { user, token };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('An account already exists with this email address.');
      }
      throw error;
    }
  },

  async login(email: string, password: string) {
    await ensurePostgresDaemon();
    const db = requireDatabase();

    if (!email || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.query(
      'SELECT id, email, password_hash, name, provider, created_at FROM users WHERE email = $1',
      [normalizedEmail]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, userRow.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const user = userFromRow(userRow);
    const token = this.createSession(user);
    return { user, token };
  },

  async findOrCreateOAuthUser(provider: 'google' | 'github', profile: { id: string; email: string; name: string }) {
    await ensurePostgresDaemon();
    const db = requireDatabase();
    const email = profile.email.toLowerCase();

    const existing = await db.query(
      'SELECT id, email, name, provider, created_at FROM users WHERE email = $1',
      [email]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      const user = userFromRow(existing.rows[0]);
      const token = this.createSession(user);
      return { user, token };
    }

    const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name, provider) VALUES ($1, $2, $3, $4) RETURNING id, email, name, provider, created_at',
      [email, placeholderHash, profile.name || email.split('@')[0], provider]
    );

    const user = userFromRow(result.rows[0]);
    const token = this.createSession(user);
    return { user, token };
  },

  createSession(user: AuthUser): string {
    return jwt.sign(
      {
        sub: user.id,
        id: user.id,
        email: user.email,
        name: user.name
      },
      getJwtSecret(),
      {
        expiresIn: '7d',
        issuer: 'patles-ai',
        audience: 'patles-ai-web'
      }
    );
  },

  async getSessionUser(token?: string): Promise<AuthUser | null> {
    if (!token) return null;
    try {
      const payload = jwt.verify(token, getJwtSecret(), {
        issuer: 'patles-ai',
        audience: 'patles-ai-web'
      }) as jwt.JwtPayload;

      const userId = payload.sub || payload.id;
      if (!userId) return null;

      await ensurePostgresDaemon();
      const result = await requireDatabase().query(
        'SELECT id, email, name, provider, created_at FROM users WHERE id = $1',
        [userId]
      );

      return result.rowCount ? userFromRow(result.rows[0]) : null;
    } catch {
      return null;
    }
  }
};
