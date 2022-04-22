import z from 'zod';
import { generateAuthUrl } from '~/libs/authentication';
import createRouter from '~/libs/trpc/server';
import superjson from 'superjson';

export const appRouter = createRouter()
  .transformer(superjson)
  .query('authUrl', {
    input: z.object({
      withBot: z.boolean(),
    }),
    resolve({ input }) {
      return {
        authUrl: generateAuthUrl(input.withBot),
      };
    },
  });

export type AppRouter = typeof appRouter;

export default appRouter;
