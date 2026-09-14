import { type AppType } from "next/app";
import Head from "next/head";

import { api } from "~/utils/api";

import "katex/dist/katex.min.css";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Check out here for authentication with Clerk - https://clerk.com/docs/nextjs/pages-react

// Loads the index.tsx because that is the root page.
// Next looks for index.tsx as it's root page.

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        {/* Make the layout scale correctly on phones */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
