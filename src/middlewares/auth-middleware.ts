import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

type Env = {
  DB: D1Database;
  JWT_SECRET: string;
};

type Variables = {
  jwtPayload: {
    userId: string;
  };
};

export const authMiddleware = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next,
) => {
  try {
    const token = getCookie(c, 'access_token');

    if (!token) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const decoded = await verify(token, c.env.JWT_SECRET);

    if (!decoded || !decoded.sub) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('jwtPayload', {
      userId: decoded.sub,
    });

    const test = c.get('jwtPayload').userId;

    console.log(test);

    return await next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    return c.json({ error: 'Authentication failed' }, 401);
  }
};
