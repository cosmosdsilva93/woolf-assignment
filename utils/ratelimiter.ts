import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 300, // 300 requests
  duration: 3600, // per hour
  execEvenly: false,
  keyPrefix: 'middleware',
});

const minuteLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 60, // per minute
  execEvenly: false,
  keyPrefix: 'minute',
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token for rate limiting' });
  }

  try {
    await Promise.all([
      rateLimiter.consume(token),
      minuteLimiter.consume(token),
    ]);
    next();
  } catch (err) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
};