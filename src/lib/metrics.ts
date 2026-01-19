import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from "prom-client";

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

// Database failure tracking
export const databaseQueryFailures = new Counter({
  name: "database_query_failures_total",
  help: "Total number of failed database queries",
  labelNames: ["operation", "table", "error_type"],
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

export const activeUsersGauge = new Gauge({
  name: "active_users_total",
  help: "Total number of authenticated API requests",
  registers: [register],
});

// Database connection status (1 = connected, 0 = disconnected)
export const databaseConnectionStatus = new Gauge({
  name: "database_connection_status",
  help: "Database connection status (1 = connected, 0 = disconnected)",
  registers: [register],
});

export const databaseQueryDuration = new Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
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

// ==========================================
// Additional Histograms
// ==========================================

// Payment processing duration histogram
export const paymentProcessingDuration = new Histogram({
  name: "payment_processing_duration_seconds",
  help: "Duration of Stripe payment processing in seconds",
  labelNames: ["status"],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10, 30],
  registers: [register],
});

// Game download size histogram (in bytes)
export const gameDownloadSize = new Histogram({
  name: "game_download_size_bytes",
  help: "Size of game downloads in bytes",
  labelNames: ["game_id"],
  buckets: [
    1_000_000,      // 1 MB
    5_000_000,      // 5 MB
    50_000_000,     // 50 MB
    100_000_000,    // 100 MB
    500_000_000,    // 500 MB
    1_000_000_000,  // 1 GB
    5_000_000_000,  // 5 GB
  ],
  registers: [register],
});

// External API latency histogram
export const externalApiLatency = new Histogram({
  name: "external_api_latency_seconds",
  help: "Latency of external API calls (Stripe, Clerk, etc.)",
  labelNames: ["api_name", "endpoint"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [register],
});

// ==========================================
// VPS Utilization Gauges
// ==========================================

// CPU usage percentage
export const vpsCpuUsage = new Gauge({
  name: "vps_cpu_usage_percent",
  help: "VPS CPU usage percentage",
  registers: [register],
});

// Memory usage in bytes
export const vpsMemoryUsage = new Gauge({
  name: "vps_memory_usage_bytes",
  help: "VPS memory usage in bytes",
  registers: [register],
});

// Total memory in bytes
export const vpsMemoryTotal = new Gauge({
  name: "vps_memory_total_bytes",
  help: "VPS total memory in bytes",
  registers: [register],
});

// Disk usage in bytes
export const vpsDiskUsage = new Gauge({
  name: "vps_disk_usage_bytes",
  help: "VPS disk usage in bytes",
  registers: [register],
});

// Total disk capacity in bytes
export const vpsDiskTotal = new Gauge({
  name: "vps_disk_total_bytes",
  help: "VPS total disk capacity in bytes",
  registers: [register],
});

// Network bytes received
export const vpsNetworkRx = new Gauge({
  name: "vps_network_rx_bytes",
  help: "VPS network bytes received",
  registers: [register],
});

// Network bytes transmitted
export const vpsNetworkTx = new Gauge({
  name: "vps_network_tx_bytes",
  help: "VPS network bytes transmitted",
  registers: [register],
});

// System uptime in seconds
export const vpsUptime = new Gauge({
  name: "vps_uptime_seconds",
  help: "VPS system uptime in seconds",
  registers: [register],
});

// ==========================================
// VPS Metrics Collection (Node.js os module)
// ==========================================

import * as os from "os";
import { execSync } from "child_process";

// Store previous CPU times for calculating usage
let previousCpuTimes: { idle: number; total: number } | null = null;

/**
 * Get CPU usage percentage by comparing idle time between measurements
 */
function getCpuUsagePercent(): number {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    idle += cpu.times.idle;
    total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
  }

  if (previousCpuTimes === null) {
    previousCpuTimes = { idle, total };
    return 0;
  }

  const idleDiff = idle - previousCpuTimes.idle;
  const totalDiff = total - previousCpuTimes.total;
  previousCpuTimes = { idle, total };

  if (totalDiff === 0) return 0;
  return ((totalDiff - idleDiff) / totalDiff) * 100;
}

/**
 * Get disk usage using df command (Linux)
 */
function getDiskUsage(): { used: number; total: number } {
  try {
    const output = execSync("df -B1 / | tail -1", { encoding: "utf8" });
    const parts = output.trim().split(/\s+/);
    return {
      total: parseInt(parts[1], 10) || 0,
      used: parseInt(parts[2], 10) || 0,
    };
  } catch {
    return { used: 0, total: 0 };
  }
}

/**
 * Get network I/O from /proc/net/dev (Linux)
 */
function getNetworkIO(): { rx: number; tx: number } {
  try {
    const output = execSync("cat /proc/net/dev | grep -E 'eth0|ens|enp' | head -1", { encoding: "utf8" });
    const parts = output.trim().split(/\s+/);
    // Format: interface: rx_bytes rx_packets ... tx_bytes tx_packets ...
    return {
      rx: parseInt(parts[1], 10) || 0,
      tx: parseInt(parts[9], 10) || 0,
    };
  } catch {
    return { rx: 0, tx: 0 };
  }
}

/**
 * Collect and update all VPS metrics
 */
export function collectVpsMetrics(): void {
  // CPU usage
  const cpuUsage = getCpuUsagePercent();
  vpsCpuUsage.set(cpuUsage);

  // Memory
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  vpsMemoryTotal.set(totalMem);
  vpsMemoryUsage.set(usedMem);

  // Disk
  const disk = getDiskUsage();
  vpsDiskTotal.set(disk.total);
  vpsDiskUsage.set(disk.used);

  // Network
  const network = getNetworkIO();
  vpsNetworkRx.set(network.rx);
  vpsNetworkTx.set(network.tx);

  // Uptime
  vpsUptime.set(os.uptime());
}

// Collect VPS metrics every 15 seconds
const VPS_METRICS_INTERVAL_MS = 15_000;
let vpsMetricsInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start automatic VPS metrics collection
 */
export function startVpsMetricsCollection(): void {
  if (vpsMetricsInterval) return; // Already running
  
  // Collect immediately
  collectVpsMetrics();
  
  // Then collect periodically
  vpsMetricsInterval = setInterval(collectVpsMetrics, VPS_METRICS_INTERVAL_MS);
}

/**
 * Stop automatic VPS metrics collection
 */
export function stopVpsMetricsCollection(): void {
  if (vpsMetricsInterval) {
    clearInterval(vpsMetricsInterval);
    vpsMetricsInterval = null;
  }
}

// Auto-start VPS metrics collection when module is imported
startVpsMetricsCollection();
