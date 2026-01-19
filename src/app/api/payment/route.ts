import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  httpRequestsTotal,
  httpRequestDuration,
  paymentSessionsTotal,
  paymentProcessingDuration,
  externalApiLatency,
} from "@/lib/metrics";

// Lazy-initialize Stripe to avoid build-time errors
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-11-17.clover",
    });
  }
  return stripe;
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const route = "/api/payment";
  
  try {
    const { arrayProductId, discounts } = await req.json();

    console.log("Received product IDs:", arrayProductId);
    console.log("Received discounts:", discounts);

    if (!arrayProductId || !Array.isArray(arrayProductId) || arrayProductId.length === 0) {
      httpRequestsTotal.inc({ method: "POST", route, status_code: "400" });
      httpRequestDuration.observe(
        { method: "POST", route, status_code: "400" },
        (Date.now() - startTime) / 1000
      );
      return NextResponse.json({ error: "No products provided" }, { status: 400 });
    }

    // Fetch active prices for all products
    const pricePromises = arrayProductId.map((productId: string) =>
      getStripe().prices.list({
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

    // Measure Stripe API call duration
    const stripeStart = Date.now();
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
      ...(Object.keys(discountParam).length > 0 && discountParam),
    });
    const stripeDuration = (Date.now() - stripeStart) / 1000;
    
    // Record external API latency
    externalApiLatency.observe(
      { api_name: "stripe", endpoint: "checkout.sessions.create" },
      stripeDuration
    );
    
    // Record total payment processing duration
    paymentProcessingDuration.observe(
      { status: session.url ? "success" : "failed" },
      (Date.now() - startTime) / 1000
    );

    // This is the key check!
    if (!session.url) {
      console.error("Stripe session created but has no URL:", session);
      paymentSessionsTotal.inc({ status: "failed" });
      httpRequestsTotal.inc({ method: "POST", route, status_code: "500" });
      httpRequestDuration.observe(
        { method: "POST", route, status_code: "500" },
        (Date.now() - startTime) / 1000
      );
      return NextResponse.json({ error: "Failed to generate checkout URL" }, { status: 500 });
    }

    paymentSessionsTotal.inc({ status: "success" });
    httpRequestsTotal.inc({ method: "POST", route, status_code: "200" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "200" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ 
      id: session.id, 
      url: session.url 
    });

  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    // Better error logging
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || "unknown";

    paymentSessionsTotal.inc({ status: "error" });
    httpRequestsTotal.inc({ method: "POST", route, status_code: "500" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "500" },
      (Date.now() - startTime) / 1000
    );
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