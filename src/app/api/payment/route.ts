import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover", // Use the required Stripe API version
});

export async function POST(req: NextRequest) {
  try {
    const { arrayProductId, discounts } = await req.json();

    console.log("Received product IDs:", arrayProductId);
    console.log("Received discounts:", discounts);

    if (!arrayProductId || !Array.isArray(arrayProductId) || arrayProductId.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    // Fetch active prices for all products
    const pricePromises = arrayProductId.map((productId: string) =>
      stripe.prices.list({
        product: productId,
        active: true,
        limit: 100, // in case there are many
      })
    );

    const priceResults = await Promise.all(pricePromises);
    const allPrices = priceResults.flatMap(result => result.data);

    if (allPrices.length === 0) {
      console.warn("No active prices found for products:", arrayProductId);
      return NextResponse.json({ error: "No active prices found for the selected products" }, { status: 400 });
    }

    // Optional: prefer one-time prices over recurring
    const oneTimePrices = allPrices.filter(p => p.type === "one_time");
    const pricesToUse = oneTimePrices.length > 0 ? oneTimePrices : allPrices;

    const lineItems = pricesToUse.map((price) => ({
      price: price.id,
      quantity: 1,
    }));

    // Handle discounts properly — ONLY if they are real Stripe Coupon IDs
    let discountParam: { discounts?: { coupon: string }[] } = {};

    if (discounts && Array.isArray(discounts) && discounts.length > 0) {
      // Validate that each discount is a real coupon ID (starts with "coupon_")
      const validCoupons = discounts
        .map((d: any) => d.discount)
        .filter((couponId: string) => typeof couponId === "string" && couponId.startsWith("coupon_"));

      if (validCoupons.length > 0) {
        discountParam.discounts = validCoupons.map(coupon => ({ coupon }));
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      ...(Object.keys(discountParam).length > 0 && discountParam),
    });

    // This is the key check!
    if (!session.url) {
      console.error("Stripe session created but has no URL:", session);
      return NextResponse.json({ error: "Failed to generate checkout URL" }, { status: 500 });
    }

    return NextResponse.json({ 
      id: session.id, 
      url: session.url 
    });

  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    // Better error logging
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || "unknown";

    return NextResponse.json(
      { 
        error: "Failed to create checkout session",
        details: errorMessage,
        code: errorCode
      },
      { status: 500 }
    );
  }
}