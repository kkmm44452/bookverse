// import type { Config } from '@netlify/functions';
// import crypto from 'crypto';

// import { sql } from './utils/db';
// import { verifyToken } from './utils/auth';

// interface VerifyPaymentRequest {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
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
//     // Authentication
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
//       await request.json() as VerifyPaymentRequest;

//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature
//     } = body;

//     if (
//       !razorpay_payment_id ||
//       !razorpay_order_id ||
//       !razorpay_signature
//     ) {
//       return Response.json(
//         {
//           success: false,
//           message: 'Payment details are required'
//         },
//         { status: 400 }
//       );
//     }

//     // -----------------------------
//     // Get our order from Neon
//     // -----------------------------

//     const orders = await sql`
//       SELECT
//         id,
//         user_id,
//         razorpay_order_id,
//         payment_status
//       FROM orders
//       WHERE razorpay_order_id = ${razorpay_order_id}
//         AND user_id = ${authUser.userId}
//       LIMIT 1
//     `;

//     if (orders.length === 0) {
//       return Response.json(
//         {
//           success: false,
//           message: 'Order not found'
//         },
//         { status: 404 }
//       );
//     }

//     const order = orders[0];

//     // -----------------------------
//     // Prevent duplicate processing
//     // -----------------------------

//     if (order.payment_status === 'PAID') {
//       return Response.json({
//         success: true,
//         message: 'Payment already verified',
//         orderId: order.id
//       });
//     }

//     // -----------------------------
//     // Razorpay secret
//     // -----------------------------

//     const secret =
//       process.env['RAZORPAY_KEY_SECRET'];

//     if (!secret) {
//       throw new Error(
//         'RAZORPAY_KEY_SECRET is not configured'
//       );
//     }

//     // IMPORTANT:
//     // Use razorpay_order_id from our database,
//     // not a blindly trusted browser value.
//     const generatedSignature =
//       crypto
//         .createHmac('sha256', secret)
//         .update(
//           `${order.razorpay_order_id}|${razorpay_payment_id}`
//         )
//         .digest('hex');

//     // -----------------------------
//     // Timing-safe comparison
//     // -----------------------------

//     const expected =
//       Buffer.from(generatedSignature, 'hex');

//     const received =
//       Buffer.from(razorpay_signature, 'hex');

//     if (
//       expected.length !== received.length ||
//       !crypto.timingSafeEqual(expected, received)
//     ) {

//       return Response.json(
//         {
//           success: false,
//           message: 'Payment verification failed'
//         },
//         { status: 400 }
//       );
//     }

//     // -----------------------------
//     // Payment verified
//     // -----------------------------

//     await sql`
//       UPDATE orders
//       SET
//         razorpay_payment_id =
//           ${razorpay_payment_id},

//         razorpay_signature =
//           ${razorpay_signature},

//         payment_status =
//           'PAID',

//         paid_at =
//           NOW()

//       WHERE id = ${order.id}
//     `;

//     return Response.json({
//       success: true,
//       message: 'Payment verified successfully',
//       orderId: order.id
//     });

//   } catch (error) {

//     console.error(
//       'Payment verification error:',
//       error
//     );

//     return Response.json(
//       {
//         success: false,
//         message: 'Unable to verify payment'
//       },
//       { status: 500 }
//     );
//   }
// };

// export const config: Config = {
//   path: '/api/payment/verify'
// };

import type { Config } from '@netlify/functions';
import crypto from 'crypto';
import { sql } from './utils/db';
import { verifyToken } from './utils/auth';

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
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

    // --------------------------------
    // AUTH
    // --------------------------------

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

    const token =
      authHeader.substring(7);

    const authUser =
      verifyToken(token);

    console.log(
      'Authenticated user:',
      authUser.userId
    );


    // --------------------------------
    // REQUEST
    // --------------------------------

    const body =
      await request.json() as VerifyPaymentRequest;

    const razorpayPaymentId =
      body.razorpay_payment_id?.trim();

    const razorpayOrderId =
      body.razorpay_order_id?.trim();

    const razorpaySignature =
      body.razorpay_signature?.trim();


    if (
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {

      return Response.json(
        {
          success: false,
          message: 'Payment details are incomplete'
        },
        { status: 400 }
      );
    }


    // --------------------------------
    // RAZORPAY SECRET
    // --------------------------------

    const keySecret =
      process.env['RAZORPAY_KEY_SECRET'];

    if (!keySecret) {

      throw new Error(
        'RAZORPAY_KEY_SECRET is not configured'
      );
    }


    // --------------------------------
    // VERIFY SIGNATURE
    // --------------------------------

    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          keySecret
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest('hex');


    const isValid =
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpaySignature)
      );


    if (!isValid) {

      console.error(
        'Invalid Razorpay signature'
      );

      return Response.json(
        {
          success: false,
          message: 'Payment verification failed'
        },
        { status: 400 }
      );
    }


    console.log(
      'Razorpay signature verified'
    );


    // --------------------------------
    // FIND ORDER
    // --------------------------------

    const existingOrders = await sql`

      SELECT
        id,
        order_number,
        user_id,
        address_id,
        total_amount,
        currency,
        payment_status,
        order_status,
        razorpay_order_id

      FROM orderrs

      WHERE razorpay_order_id =
        ${razorpayOrderId}

        AND user_id =
        ${authUser.userId}

      LIMIT 1

    `;


    if (existingOrders.length === 0) {

      return Response.json(
        {
          success: false,
          message: 'Order not found'
        },
        { status: 404 }
      );
    }


    const existingOrder =
      existingOrders[0];


    // --------------------------------
    // PREVENT DOUBLE VERIFICATION
    // --------------------------------

    if (
      existingOrder.payment_status === 'paid'
    ) {

      return Response.json({
        success: true,
        message: 'Payment already verified',
        orderId: existingOrder.id
      });
    }


    // --------------------------------
    // UPDATE ORDER
    // --------------------------------

    const updatedOrders = await sql`

      UPDATE orderrs

      SET

        payment_status =
          'paid',

        order_status =
          'confirmed',

        razorpay_payment_id =
          ${razorpayPaymentId},

        razorpay_signature =
          ${razorpaySignature},

        updated_at =
          NOW()

      WHERE id =
        ${existingOrder.id}

        AND user_id =
        ${authUser.userId}

      RETURNING
        id,
        order_number,
        user_id,
        address_id,
        total_amount,
        currency,
        payment_status,
        order_status,
        razorpay_order_id,
        razorpay_payment_id,
        created_at,
        updated_at

    `;


    if (updatedOrders.length === 0) {

      return Response.json(
        {
          success: false,
          message: 'Unable to update order'
        },
        { status: 500 }
      );
    }


    const order =
      updatedOrders[0];


    console.log(
      'Payment verified and order updated:',
      order.id
    );


    // --------------------------------
    // RESPONSE
    // --------------------------------

    return Response.json({

      success: true,

      message:
        'Payment verified successfully',

      orderId:
        order.id,

      orderNumber:
        order.order_number,

      order

    });

  } catch (error) {

    console.error(
      'Payment verification error:',
      error
    );

    return Response.json(
      {
        success: false,
        message:
          'Unable to verify payment'
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: '/api/payment/verify'
};