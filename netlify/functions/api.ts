import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { githubRouter } from '../../server/routes/githubRoutes.js';
import { projectRouter } from '../../server/routes/projectRoutes.js';
import { authRouter } from '../../server/routes/authRoutes.js';
import { authService } from '../../server/services/authService.js';

dotenv.config();

const app = express();

// CORS: allow any origin with credentials
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  next();
});

app.options('*', (_req, res) => res.sendStatus(200));

app.use(express.json({ limit: '10mb' }));

// Initialize auth service (non-blocking — falls back to memory store if no DB)
authService.initialize().catch((err) => {
  console.warn('Auth service init:', err?.message || err);
});

// Initialize Gemini AI if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    timestamp: new Date().toISOString(),
    engine: geminiApiKey ? 'Gemini 3.8 Flash' : 'Patles Semantic Generator',
  });
});

// Mount routers — same paths as the main server
app.use('/api/auth', authRouter);
app.use('/api/github', githubRouter);
app.use('/api/projects', projectRouter);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// Export handler — serverless-http bridges Express ↔ Netlify Lambda
export const handler = serverless(app, {
  // Strip the Netlify function path prefix so Express sees /api/...
  request(request: any) {
    // Netlify calls /.netlify/functions/api/... but redirects rewrite to /api/...
    return request;
  },
});
