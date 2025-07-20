// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE as string, // Never expose this on client side
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
      expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
      // token: "random-token", // Optional, a unique token for request
    });

    return Response.json({
      authenticParameters,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return Response.json(
      { error: "ImageKit authentication failed" },
      { status: 500 }
    );
  }
}
