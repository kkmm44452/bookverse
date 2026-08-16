import type { Config } from '@netlify/functions';
import { sql } from './utils/db';

export default async (request: Request) => {

  if (request.method !== 'GET') {

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

    // --------------------------------
    // ORDER ID
    // --------------------------------

    const url =
      new URL(request.url);

    const orderId =
      url.searchParams.get('orderId');

    if (!orderId) {

      return Response.json(
        {
          success: false,
          message: 'Order ID is required'
        },
        {
          status: 400
        }
      );

    }

    console.log(
      'Fetching order:',
      orderId
    );


    // --------------------------------
    // GET ORDER BY DATABASE ID
    // --------------------------------

    const orders = await sql`

      SELECT
        id,
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

      FROM orderrs

      WHERE id = ${orderId}

      LIMIT 1

    `;


    // --------------------------------
    // NOT FOUND
    // --------------------------------

    if (orders.length === 0) {

      console.log(
        'Order not found:',
        orderId
      );

      return Response.json(
        {
          success: false,
          message: 'Order not found'
        },
        {
          status: 404
        }
      );

    }


    const order =
      orders[0];


    console.log(
      'Order fetched:',
      order
    );


    // --------------------------------
    // RESPONSE
    // --------------------------------

    return Response.json({

      success: true,

      order

    });


  } catch (error) {

    console.error(
      'Get order error:',
      error
    );

    return Response.json(
      {
        success: false,
        message: 'Unable to fetch order'
      },
      {
        status: 500
      }
    );

  }

};


export const config: Config = {
  path: '/api/order/get'
};