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

export default prisma;