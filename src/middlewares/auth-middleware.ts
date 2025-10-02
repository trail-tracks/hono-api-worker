import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';
import { AppBindings, AppVariables } from '../types/env';

export const authMiddleware = async (
  c: Context<{ Bindings: AppBindings; Variables: AppVariables }>,
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

    return await next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auth middleware error:', error);

    return c.json({ error: 'Authentication failed' }, 401);
  }
};
