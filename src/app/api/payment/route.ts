import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { arrayProductId, discounts } = await req.json();

    const prices = await Promise.all(
      arrayProductId.map((product: string) =>
        stripe.prices.list({
          product,
          active: true,
        })
      )
    ).then((results) => results.flatMap((result) => result.data));

    const lineItems = prices.map((price) => ({
      price: price.id,
      quantity: 1,
    }));

    const setDiscounts = discounts.map(
      (couponId: { game_id: number; discount: string }) => ({
        coupon: couponId.discount,
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      discounts: setDiscounts,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });
    return NextResponse.json({ id: session.id });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
