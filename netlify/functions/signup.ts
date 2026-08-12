import type { Config } from '@netlify/functions';
import * as argon2 from 'argon2';

import { sql } from './utils/db';
import { createToken } from './utils/auth';

interface SignupRequest {
  name: string;
  email: string;
  mobileNumber?: string;
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

    const body = await request.json() as SignupRequest;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const mobileNumber = body.mobileNumber?.trim();
    const password = body.password;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name) {
      return Response.json(
        {
          success: false,
          message: 'Name is required'
        },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json(
        {
          success: false,
          message: 'Email is required'
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return Response.json(
        {
          success: false,
          message: 'Password must contain at least 8 characters'
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Check existing user
    // -----------------------------

    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return Response.json(
        {
          success: false,
          message: 'An account with this email already exists'
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const passwordHash = await argon2.hash(password);

    // -----------------------------
    // Insert user
    // -----------------------------

    const users = await sql`
  INSERT INTO public.users (
    email,
    name,
    mobile_number,
    password_hash,
    is_active,
    auth_provider,
    created_at,
    modified_at
  )
  VALUES (
    ${email},
    ${name},
    ${mobileNumber || null},
    ${passwordHash},
    TRUE,
    'local',
    NOW(),
    NOW()
  )
  RETURNING
    id,
    email,
    name,
    mobile_number,
    created_at
`;

    const user = users[0];

    // -----------------------------
    // Create JWT
    // -----------------------------

    const token = createToken(
      String(user.id),
      String(user.email)
    );

    return Response.json(
      {
        success: true,
        message: 'Account created successfully',

        token,

        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          mobileNumber: user.mobile_number
        }
      },
      {
        status: 201
      }
    );

  } catch (error) {

    console.error('Signup error:', error);

    return Response.json(
      {
        success: false,
        message: 'Unable to create account'
      },
      {
        status: 500
      }
    );
  }
};

export const config: Config = {
  path: '/api/signup'
};