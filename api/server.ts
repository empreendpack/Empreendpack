import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { commerceRouter } from "../server/routers/commerce";
import { router } from "../server/_core/trpc";

const app = express();

const appRouter = router({
  commerce: commerceRouter,
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

export default app;
 
