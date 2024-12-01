import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { satelliteRouter } from "./routers/satellite";

export const appRouter = createTRPCRouter({
  satellite: satelliteRouter,
});

export type AppRouter = typeof appRouter;
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
