import type { Config } from '@netlify/functions';
import { sql } from './utils/db';
import { verifyToken } from './utils/auth';

interface AddressRequest {
  fullName: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export default async (request: Request) => {

  if (request.method !== 'POST') {
    return Response.json(
      {
        success: false,
        message: 'Method not allowed'
      },
      { status: 405 }
    );
  }

  try {

    // -----------------------------
    // AUTH
    // -----------------------------

    const authHeader =
      request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const authUser = verifyToken(token);

    // -----------------------------
    // REQUEST
    // -----------------------------

    const body =
      await request.json() as AddressRequest;

    const fullName =
      body.fullName?.trim();

    const mobileNumber =
      body.mobileNumber?.trim();

    const addressLine1 =
      body.addressLine1?.trim();

    const addressLine2 =
      body.addressLine2?.trim() || null;

    const city =
      body.city?.trim();

    const state =
      body.state?.trim();

    const postalCode =
      body.postalCode?.trim();

    const country =
      body.country?.trim() || 'India';

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (
      !fullName ||
      !mobileNumber ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return Response.json(
        {
          success: false,
          message: 'All required address fields must be provided'
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // INSERT ADDRESS
    // -----------------------------

    const addresses = await sql`
      INSERT INTO addresses (
        user_id,
        full_name,
        mobile_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country
      )
      VALUES (
        ${authUser.userId},
        ${fullName},
        ${mobileNumber},
        ${addressLine1},
        ${addressLine2},
        ${city},
        ${state},
        ${postalCode},
        ${country}
      )
      RETURNING
        id,
        user_id,
        full_name,
        mobile_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country
    `;

    const address = addresses[0];

    console.log(
      'Address created:',
      address.id
    );

    return Response.json(
      {
        success: true,
        message: 'Address saved successfully',
        address
      },
      { status: 201 }
    );

  } catch (error) {

    console.error(
      'Create address error:',
      error
    );

    return Response.json(
      {
        success: false,
        message: 'Unable to save address'
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: '/api/address/create'
};