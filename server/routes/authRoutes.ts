import express, { Request, Response } from 'express';
import crypto from 'node:crypto';
import { authService } from '../services/authService.js';

export const authRouter = express.Router();
const cookieName = 'patles_session';

const getSessionToken = (req: Request): string | undefined => {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // 2. Check HttpOnly cookie
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${cookieName}=`));
    if (match) {
      return match.slice(cookieName.length + 1);
    }
  }

  return undefined;
};

const setSessionCookie = (res: Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
};

const appUrl = () => process.env.APP_URL || 'http://localhost:3000';

const oauthConfig = (provider: 'google' | 'github') =>
  provider === 'google'
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
        token: 'https://oauth2.googleapis.com/token',
        profile: 'https://openidconnect.googleapis.com/v1/userinfo',
        scope: 'openid email profile'
      }
    : {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        authorize: 'https://github.com/login/oauth/authorize',
        token: 'https://github.com/login/oauth/access_token',
        profile: 'https://api.github.com/user',
        scope: 'read:user user:email'
      };

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const { user, token } = await authService.register(email, password, name);
    setSessionCookie(res, token);

    return res.status(201).json({
      message: 'Account created successfully.',
      user,
      token
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const { user, token } = await authService.login(email, password);
    setSessionCookie(res, token);

    return res.status(200).json({
      message: 'Login successful.',
      user,
      token
    });
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid email or password.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return res.status(401).json({ error: 'No active session found. Please sign in.' });
    }

    const user = await authService.getSessionUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    }

    return res.json({ user });
  } catch (error: any) {
    return res.status(401).json({ error: 'Authentication failed.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(cookieName, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.status(200).json({ message: 'Logged out successfully.' });
});

// OAuth routes
authRouter.get('/:provider/start', (req: Request, res: Response) => {
  const provider = req.params.provider as 'google' | 'github';
  if (!['google', 'github'].includes(provider)) {
    return res.sendStatus(404);
  }

  const config = oauthConfig(provider);
  if (!config.clientId || !config.clientSecret) {
    return res.redirect(`/?authError=${provider}_not_configured`);
  }

  const state = crypto.randomBytes(24).toString('base64url');
  res.cookie(`patles_oauth_${provider}`, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600000,
    path: '/'
  });

  const url = new URL(config.authorize);
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', `${appUrl()}/api/auth/${provider}/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', config.scope);
  url.searchParams.set('state', state);

  return res.redirect(url.toString());
});

authRouter.get('/:provider/callback', async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider as 'google' | 'github';
    const config = oauthConfig(provider);
    const stateCookie = req.headers.cookie
      ?.split(';')
      .map((v) => v.trim())
      .find((v) => v.startsWith(`patles_oauth_${provider}=`))
      ?.split('=')[1];

    if (!req.query.code || !stateCookie || req.query.state !== stateCookie) {
      throw new Error('OAuth verification failed.');
    }

    const tokenResponse = await fetch(config.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: new URLSearchParams({
        client_id: config.clientId!,
        client_secret: config.clientSecret!,
        code: String(req.query.code),
        redirect_uri: `${appUrl()}/api/auth/${provider}/callback`,
        grant_type: 'authorization_code'
      })
    });

    const tokenData: any = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('OAuth provider did not return an access token.');
    }

    const profileResponse = await fetch(config.profile, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Patles-AI'
      }
    });

    const profile: any = await profileResponse.json();
    let email = profile.email;

    if (provider === 'github' && !email) {
      const emails: any = await (
        await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'Patles-AI'
          }
        })
      ).json();
      email = emails.find((entry: any) => entry.primary && entry.verified)?.email;
    }

    if (!email) {
      throw new Error('Your OAuth account does not provide a verified email address.');
    }

    const { user, token } = await authService.findOrCreateOAuthUser(provider, {
      id: String(profile.sub || profile.id),
      email,
      name: profile.name || profile.login || ''
    });

    setSessionCookie(res, token);
    return res.redirect(`${appUrl()}/?oauth=success`);
  } catch (error: any) {
    return res.redirect(`${appUrl()}/?authError=${encodeURIComponent(error.message || 'oauth_failed')}`);
  }
});
