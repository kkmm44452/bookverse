import type { Config } from '@netlify/functions';
import * as argon2 from 'argon2';

import { sql } from './utils/db';
import { createToken } from './utils/auth';

interface SigninRequest {
  email: string;
  password: string;
}

export default async (request: Request) => {

  if (request.method !== 'POST') {
    return Response.json(
      {
        success: false,
        message: 'Method not allowed'
      },
      {
        status: 405
      }
    );
  }

  try {

    const body = await request.json() as SigninRequest;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: 'Email and password are required'
        },
        {
          status: 400
        }
      );
    }

    // -----------------------------
    // Find user
    // -----------------------------

    const users = await sql`
      SELECT
        id,
        email,
        name,
        mobile_number,
        password_hash,
        is_active
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        {
          status: 401
        }
      );
    }

    const user = users[0];

    if (!user.is_active) {
      return Response.json(
        {
          success: false,
          message: 'Your account is inactive'
        },
        {
          status: 403
        }
      );
    }

    // -----------------------------
    // Verify password
    // -----------------------------

    const validPassword = await argon2.verify(
      String(user.password_hash),
      password
    );

    if (!validPassword) {
      return Response.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        {
          status: 401
        }
      );
    }

    // -----------------------------
    // Create JWT
    // -----------------------------

    const token = createToken(
      String(user.id),
      String(user.email)
    );

    return Response.json({
      success: true,
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobile_number
      }
    });

  } catch (error) {

    console.error('Signin error:', error);

    return Response.json(
      {
        success: false,
        message: 'Unable to sign in'
      },
      {
        status: 500
      }
    );
  }
};

export const config: Config = {
  path: '/api/signin'
};