import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client';
import { databaseQueryFailures, databaseConnectionStatus } from './metrics';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prismaClientSingleton = () => {
  const client = new PrismaClient({ adapter });
  
  // Set initial connection status
  databaseConnectionStatus.set(1);
  
  return client;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  dbHealthCheckInterval?: ReturnType<typeof setInterval>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// Helper function to wrap database operations with failure tracking
export async function withDbTracking<T>(
  operation: string,
  table: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const result = await fn();
    // Connection successful
    databaseConnectionStatus.set(1);
    return result;
  } catch (error) {
    // Track the failure
    const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';
    databaseQueryFailures.inc({ operation, table, error_type: errorType });
    
    // Check if it's a connection error
    if (error instanceof Error && 
        (error.message.includes('connect') || 
         error.message.includes('ECONNREFUSED') ||
         error.message.includes('timeout'))) {
      databaseConnectionStatus.set(0);
    }
    
    throw error;
  }
}

// ==========================================
// Active Database Health Check
// ==========================================

const DB_HEALTH_CHECK_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Check database connectivity and update the connection status metric
 */
async function checkDatabaseHealth(): Promise<void> {
  try {
    // Simple query to check if database is reachable
    await prisma.$queryRaw`SELECT 1`;
    databaseConnectionStatus.set(1);
  } catch (error) {
    console.error('[Database Health Check] Connection failed:', error instanceof Error ? error.message : 'Unknown error');
    databaseConnectionStatus.set(0);
  }
}

/**
 * Start active database health check
 */
export function startDatabaseHealthCheck(): void {
  if (globalThis.dbHealthCheckInterval) return; // Already running
  
  // Check immediately
  checkDatabaseHealth();
  
  // Then check periodically
  globalThis.dbHealthCheckInterval = setInterval(checkDatabaseHealth, DB_HEALTH_CHECK_INTERVAL_MS);
}

/**
 * Stop active database health check
 */
export function stopDatabaseHealthCheck(): void {
  if (globalThis.dbHealthCheckInterval) {
    clearInterval(globalThis.dbHealthCheckInterval);
    globalThis.dbHealthCheckInterval = undefined;
  }
}

// Auto-start health check when module is imported (server-side only)
if (typeof window === 'undefined') {
  startDatabaseHealthCheck();
}

export default prisma;