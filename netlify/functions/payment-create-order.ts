// import type { Config } from '@netlify/functions';
// import Razorpay from 'razorpay';
// import { sql } from './utils/db';
// import { verifyToken } from './utils/auth';

// interface CreateOrderRequest {
//   amount: number;
//   currency?: string;
//   addressId?: string;
// }

// export default async (request: Request) => {

//   if (request.method !== 'POST') {
//     return Response.json(
//       {
//         success: false,
//         message: 'Method not allowed'
//       },
//       { status: 405 }
//     );
//   }

//   try {

//     // -----------------------------
//     // Authorization
//     // -----------------------------

//     const authHeader =
//       request.headers.get('authorization');

//     if (!authHeader?.startsWith('Bearer ')) {
//       return Response.json(
//         {
//           success: false,
//           message: 'Authentication required'
//         },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.substring(7);

//     const authUser = verifyToken(token);

//     // -----------------------------
//     // Request
//     // -----------------------------

//     const body =
//       await request.json() as CreateOrderRequest;

//     const amount = Number(body.amount);

//     if (!amount || amount <= 0) {
//       return Response.json(
//         {
//           success: false,
//           message: 'Invalid amount'
//         },
//         { status: 400 }
//       );
//     }

//     // Razorpay expects amount in paise
//     const amountInPaise = Math.round(amount * 100);

//     // -----------------------------
//     // Razorpay
//     // -----------------------------

//     const keyId =
//       process.env['RAZORPAY_KEY_ID'];

//     const keySecret =
//       process.env['RAZORPAY_KEY_SECRET'];

//     if (!keyId || !keySecret) {
//       throw new Error(
//         'Razorpay environment variables are not configured'
//       );
//     }

//     const razorpay = new Razorpay({
//       key_id: keyId,
//       key_secret: keySecret
//     });

//     // -----------------------------
//     // Create Razorpay order
//     // -----------------------------

//     const razorpayOrder =
//       await razorpay.orders.create({
//         amount: amountInPaise,
//         currency: body.currency || 'INR',
//         receipt: `BV_${Date.now()}`,
//         notes: {
//           userId: authUser.userId
//         }
//       });

//     // -----------------------------
//     // Save pending order
//     // -----------------------------

//     await sql`
//       INSERT INTO orders (
//         user_id,
//         razorpay_order_id,
//         amount,
//         currency,
//         payment_status,
//         address_id,
//         created_at
//       )
//       VALUES (
//         ${authUser.userId},
//         ${razorpayOrder.id},
//         ${amount},
//         ${body.currency || 'INR'},
//         'PENDING',
//         ${body.addressId || null},
//         NOW()
//       )
//     `;

//     return Response.json({
//       success: true,
//       keyId,
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency
//     });

//   } catch (error) {

//     console.error(
//       'Create Razorpay order error:',
//       error
//     );

//     return Response.json(
//       {
//         success: false,
//         message: 'Unable to create payment order'
//       },
//       { status: 500 }
//     );
//   }
// };

// export const config: Config = {
//   path: '/api/payment/create-order'
// };
import type { Config } from '@netlify/functions';
import Razorpay from 'razorpay';

import { sql } from './utils/db';
import { verifyToken } from './utils/auth';

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  addressId: string;
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

    // -----------------------------
    // AUTHORIZATION
    // -----------------------------

    const authHeader =
      request.headers.get('authorization');

    console.log(
      'Authorization header exists:',
      !!authHeader
    );

    if (!authHeader?.startsWith('Bearer ')) {

      return Response.json(
        {
          success: false,
          message: 'Authentication required'
        },
        {
          status: 401
        }
      );

    }

    const token =
      authHeader.substring(7);

    const authUser =
      verifyToken(token);

    console.log(
      'Authenticated user:',
      authUser.userId
    );

    // -----------------------------
    // REQUEST BODY
    // -----------------------------

    const body =
      await request.json() as CreateOrderRequest;

    const amount =
      Number(body.amount);

    const currency =
      body.currency || 'INR';

    const addressId =
      body.addressId;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!amount || amount <= 0) {

      return Response.json(
        {
          success: false,
          message: 'Invalid amount'
        },
        {
          status: 400
        }
      );

    }

    if (!addressId) {

      return Response.json(
        {
          success: false,
          message: 'Address is required'
        },
        {
          status: 400
        }
      );

    }

    // -----------------------------
    // VERIFY ADDRESS
    // -----------------------------

    const addresses = await sql`
      SELECT
        id
      FROM addresses
      WHERE id = ${addressId}
        AND user_id = ${authUser.userId}
      LIMIT 1
    `;

    if (addresses.length === 0) {

      return Response.json(
        {
          success: false,
          message: 'Invalid delivery address'
        },
        {
          status: 400
        }
      );

    }

    console.log(
      'Address verified:',
      addressId
    );

    // -----------------------------
    // RAZORPAY CONFIG
    // -----------------------------

    const keyId =
      process.env['RAZORPAY_KEY_ID'];

    const keySecret =
      process.env['RAZORPAY_KEY_SECRET'];

    if (!keyId || !keySecret) {

      throw new Error(
        'Razorpay environment variables are not configured'
      );

    }

    const razorpay =
      new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });

    // -----------------------------
    // AMOUNT IN PAISE
    // -----------------------------

    const amountInPaise =
      Math.round(amount * 100);

    // -----------------------------
    // CREATE RAZORPAY ORDER
    // -----------------------------

    const razorpayOrder =
      await razorpay.orders.create({

        amount: amountInPaise,

        currency,

        receipt:
          `BV_${Date.now()}`,

        notes: {
          userId:
            authUser.userId,

          addressId
        }

      });

    console.log(
      'Razorpay order created:',
      razorpayOrder.id
    );

    // -----------------------------
    // ORDER NUMBER
    // -----------------------------

    const orderNumber =
      `BV-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    // -----------------------------
    // SAVE PENDING ORDER
    // -----------------------------

    const orders = await sql`
      INSERT INTO orderrs (
        user_id,
        address_id,
        order_number,
        total_amount,
        currency,
        payment_status,
        order_status,
        razorpay_order_id,
        created_at,
        updated_at
      )
      VALUES (
        ${authUser.userId},
        ${addressId},
        ${orderNumber},
        ${amount},
        ${currency},
        'pending',
        'pending',
        ${razorpayOrder.id},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        order_number,
        address_id,
        total_amount,
        currency,
        payment_status,
        order_status,
        razorpay_order_id
    `;

    const order =
      orders[0];

    console.log(
      'Database order created:',
      order
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return Response.json({

      success: true,

      message:
        'Payment order created',

      keyId,

      orderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      databaseOrderId:
        order.id,

      orderNumber:
        order.order_number,

      addressId:
        order.address_id

    });

  } catch (error) {

    console.error(
      'Create Razorpay order error:',
      error
    );

    return Response.json(
      {
        success: false,
        message:
          'Unable to create payment order'
      },
      {
        status: 500
      }
    );

  }

};

export const config: Config = {
  path: '/api/payment/create-order'
};