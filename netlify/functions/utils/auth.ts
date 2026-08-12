
import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
}

interface AuthTokenPayload {
  userId: string;
  email: string;
}

/**
 * Get JWT secret.
 *
 * Keeping this inside a function makes the value
 * explicitly validated every time it is needed.
 */
function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not configured'
    );
  }

  return secret;
}


/**
 * Create JWT
 */
export function createToken(
  userId: string,
  email: string
): string {

  const secret: string = getJwtSecret();

  const payload: AuthTokenPayload = {
    userId,
    email
  };

  return jwt.sign(
    payload,
    secret,
    {
      expiresIn: '7d'
    }
  );
}


/**
 * Verify JWT
 */
export function verifyToken(
  token: string
): AuthUser {

  const secret: string = getJwtSecret();

  const decoded = jwt.verify(
    token,
    secret
  );

  /*
   * jwt.verify() can return several different types.
   * We first convert to unknown, then validate the
   * actual structure ourselves.
   */
  if (
    typeof decoded !== 'object' ||
    decoded === null
  ) {
    throw new Error('Invalid token');
  }

  const payload = decoded as Record<string, unknown>;

  if (
    typeof payload['userId'] !== 'string' ||
    typeof payload['email'] !== 'string'
  ) {
    throw new Error('Invalid token payload');
  }

  return {
    userId: payload['userId'],
    email: payload['email']
  };
}
