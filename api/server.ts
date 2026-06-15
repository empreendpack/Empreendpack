/**
 * Vercel Serverless Function entry point.
 * Handles tRPC API calls for the EmpreendePack storefront.
 * Only includes commerce (Shopify) routes — no DB dependency needed.
 */
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { router, publicProcedure } from "../server/_core/trpc";
import { commerceRouter } from "../server/routers/commerce";

// Minimal router — only what the storefront needs
const appRouter = router({
  commerce: commerceRouter,
  auth: router({
    me: publicProcedure.query(() => null),
  }),
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS for Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, shopify: !!process.env.SHOPIFY_STORE_DOMAIN });
});

export default app;
