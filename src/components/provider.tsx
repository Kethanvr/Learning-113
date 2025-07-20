import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
import React from "react";

const urlendponit = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={6 * 60}>
      <ImageKitProvider urlEndpoint={urlendponit}>{children}</ImageKitProvider>
    </SessionProvider>
  );
}
