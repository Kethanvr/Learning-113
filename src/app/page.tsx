"use client";

import { useSession } from "next-auth/react";
import { VideoFeed } from "@/components/video/video-feed";
import { Homepage } from "@/components/home/homepage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: session, status } = useSession();

  // Show loading skeleton while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto p-6 space-y-4">
          <div className="animate-pulse">
            <div className="aspect-[9/16] bg-gray-800 rounded-2xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded-full w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded-full w-1/2"></div>
              <div className="h-3 bg-gray-800 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show homepage if not authenticated
  if (!session) {
    return <Homepage />;
  }

  // Show video feed if authenticated
  return <VideoFeed />;
}
