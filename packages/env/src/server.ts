import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

export const env = createEnv({
  server: {
    PORT: z.coerce.number(),
    URL: z.url(),
    CORS_ORIGINS: z
      .string()
      .transform((val) => val.split(",").map((s) => s.trim())),

    DATABASE_URL: z.string(),

    BETTER_AUTH_SECRET: z.string(),

    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
  },
  runtimeEnv: process.env,
});
