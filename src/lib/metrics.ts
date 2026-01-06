import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from "prom-client";

// Create a custom registry to avoid conflicts
export const register = new Registry();

// Add default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// HTTP request counter
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Game platform specific metrics
export const gamePurchasesTotal = new Counter({
  name: "game_purchases_total",
  help: "Total number of game purchases",
  labelNames: ["game_id"],
  registers: [register],
});

export const wishlistAdditionsTotal = new Counter({
  name: "wishlist_additions_total",
  help: "Total number of wishlist additions",
  labelNames: ["game_id"],
  registers: [register],
});

export const wishlistRemovalsTotal = new Counter({
  name: "wishlist_removals_total",
  help: "Total number of wishlist removals",
  labelNames: ["game_id"],
  registers: [register],
});

export const paymentSessionsTotal = new Counter({
  name: "payment_sessions_total",
  help: "Total number of Stripe payment sessions created",
  labelNames: ["status"],
  registers: [register],
});

export const databaseQueryDuration = new Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

// Database failure tracking
export const databaseQueryFailures = new Counter({
  name: "database_query_failures_total",
  help: "Total number of failed database queries",
  labelNames: ["operation", "table", "error_type"],
  registers: [register],
});

// Database connection status (1 = connected, 0 = disconnected)
export const databaseConnectionStatus = new Gauge({
  name: "database_connection_status",
  help: "Database connection status (1 = connected, 0 = disconnected)",
  registers: [register],
});

export const activeUsersGauge = new Counter({
  name: "active_users_total",
  help: "Total number of authenticated API requests",
  registers: [register],
});

// Contact form submissions
export const contactSubmissionsTotal = new Counter({
  name: "contact_submissions_total",
  help: "Total number of contact form submissions",
  registers: [register],
});

// Page views counter
export const pageViewsTotal = new Counter({
  name: "page_views_total",
  help: "Total number of page views",
  labelNames: ["page", "method"],
  registers: [register],
});

// User logins by country for world map
export const userLoginsByCountry = new Counter({
  name: "user_logins_by_country_total",
  help: "Total number of user logins by country",
  labelNames: ["country", "country_code", "latitude", "longitude"],
  registers: [register],
});

// Helper function to measure async operations
export async function measureDuration<T>(
  histogram: Histogram,
  labels: Record<string, string>,
  operation: () => Promise<T>
): Promise<T> {
  const end = histogram.startTimer(labels);
  try {
    const result = await operation();
    end();
    return result;
  } catch (error) {
    end();
    throw error;
  }
}
