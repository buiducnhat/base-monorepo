import type { auth } from "@erp/auth";
import { env } from "@erp/env/web";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  basePath: "/auth",
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
