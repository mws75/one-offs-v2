import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error }) => {
    console.error("=".repeat(60));
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}`);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error cause:", error.cause);
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("=".repeat(60));
  },
});
