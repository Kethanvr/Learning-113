// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
  

  try {
      const autheticParameters  = getUploadAuthParams({
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
          // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
          // token: "random-token", // Optional, a unique token for request
      })
  
      return Response.json({ autheticParameters, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
  } catch (error) {
          return Response.json(
            { error:"auth falid for image kit it "},
            {status:500})
          }
  }
