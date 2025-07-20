"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { VideoPlayer } from "./video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, Play } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  text: string;
  username: string;
  userid: string;
  createdAt: Date;
}

interface Video {
  _id: string;
  title: string;
  desciption: string;
  videourl: string;
  thumbnailurl: string;
  userId: string;
  username: string;
  likes: number;
  views: number;
  likedBy?: string[];
  comments?: Comment[];
  controls?: boolean;
  createdAt: string;
}

interface ApiResponse {
  videos: Video[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalVideos: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
  };
}

interface VideoFeedProps {
  className?: string;
}

export function VideoFeed({ className }: VideoFeedProps) {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch videos from API
  const fetchVideos = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await apiClient.get<ApiResponse>(
          `/api/video?page=${pageNum}&limit=5`
        );

        // Defensive check for response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response");
        }

        const { videos: newVideos = [], pagination } = response;

        if (append) {
          setVideos((prev) => [...prev, ...(newVideos || [])]);
        } else {
          setVideos(newVideos || []);
          setCurrentVideoIndex(0);
        }

        setHasMore(pagination?.hasNext ?? false);
        setPage(pageNum);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch videos:", err);
        setError(err.message || "Failed to load videos");
        // Set empty array on error to prevent undefined issues
        if (!append) {
          setVideos([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Load more videos when scrolling
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchVideos(page + 1, true);
    }
  }, [fetchVideos, page, loadingMore, hasMore]);

  // Handle scroll intersection for auto-play and infinite scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: containerRef.current,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute("data-index") || "0");

        if (entry.isIntersecting) {
          setCurrentVideoIndex(index);

          // Load more when near the end
          if (index >= videos.length - 2) {
            loadMore();
          }
        }
      });
    }, options);

    // Observe all video elements
    const videoElements = containerRef.current.querySelectorAll("[data-index]");
    videoElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [videos, loadMore]);

  // Initial load
  useEffect(() => {
    if (session) {
      fetchVideos();
    }
  }, [session, fetchVideos]);

  // Handle retry
  const handleRetry = () => {
    fetchVideos();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="h-screen bg-black flex items-center justify-center relative">
      <div className="w-full h-full max-w-sm mx-auto relative">
        {/* Video skeleton */}
        <Skeleton className="w-full h-full bg-gray-800 rounded-none" />

        {/* Play button skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700" />
        </div>

        {/* Bottom controls skeleton */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
          <div className="flex items-end justify-between">
            {/* Info section skeleton */}
            <div className="flex-1 pr-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700" />
                <Skeleton className="h-4 w-24 bg-gray-700" />
              </div>
              <Skeleton className="h-5 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-2/3 bg-gray-700" />
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700" />
                <Skeleton className="w-6 h-3 mt-1 bg-gray-700" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700" />
                <Skeleton className="w-4 h-3 mt-1 bg-gray-700" />
              </div>
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700" />
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state
  if (error && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center p-8 max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Connection Error
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">{error}</p>
          <Button
            onClick={handleRetry}
            className="bg-white text-black hover:bg-gray-200 font-medium px-6 py-3 rounded-full transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center p-8 max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No Videos Yet</h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Be the first to upload a video and start the conversation!
          </p>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 font-medium px-6 py-3 rounded-full transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      {loading && videos.length === 0 ? (
        // Initial loading state
        Array.from({ length: 3 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))
      ) : (
        <>
          {videos.map((video, index) => (
            <div
              key={video._id}
              data-index={index}
              className="h-screen snap-start relative"
            >
              <VideoPlayer
                video={video}
                isActive={index === currentVideoIndex}
              />
            </div>
          ))}

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="h-screen snap-start bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-white" />
                </div>
                <p className="text-white/80 font-medium">
                  Loading more videos...
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
