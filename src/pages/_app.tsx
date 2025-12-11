import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Check out here for authentication with Clerk - https://clerk.com/docs/nextjs/pages-react

// Loads the index.tsx because that is the root page.
// Next looks for index.tsx as it's root page.

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
