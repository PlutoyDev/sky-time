import createRouter from "~/libs/trpc/server";

export const appRouter = createRouter();

export type AppRouter = typeof appRouter;

export default appRouter;
