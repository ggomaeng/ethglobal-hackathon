import { PrismaClient } from '@prisma/client';

type ExtendedPrismaClient = ReturnType<typeof extendedClient>;

declare global {
  var prisma: ExtendedPrismaClient;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const prismaClientSingleton = () => {
  let prisma: ExtendedPrismaClient;
  if (IS_PRODUCTION) {
    prisma = extendedClient();
    return prisma;
  } else {
    globalThis.prisma = extendedClient();
    return globalThis.prisma;
  }
};

function extendedClient() {
  return new PrismaClient({
    log: IS_PRODUCTION
      ? ['info', 'warn', 'error']
      : ['query', 'info', 'warn', 'error'],
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          console.log(`${model}.${operation} took ${time.toFixed(2)}ms`);
          return result;
        },
      },
    },
  });
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();
if (!IS_PRODUCTION) globalThis.prisma = prisma;
