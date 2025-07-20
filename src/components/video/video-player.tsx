"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Image } from "@imagekit/next";

interface VideoPlayerProps {
  video: {
    _id: string;
    title: string;
    description: string;
    videourl: string;
    thumbnailurl: string;
    userId: {
      _id: string;
      email: string;
    };
    controls?: boolean;
    createdAt: string;
  };
  isActive: boolean;
  onTogglePlay?: () => void;
}

export function VideoPlayer({
  video,
  isActive,
  onTogglePlay,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
    onTogglePlay?.();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoClick = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
    togglePlay();
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality with API
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    navigator
      .share?.({
        title: video.title,
        text: video.description,
        url: window.location.href,
      })
      .catch(console.error);
  };

  return (
    <div className="h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover max-w-full max-h-full"
        src={video.videourl}
        poster={video.thumbnailurl}
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Video Overlay */}
      <div className="video-overlay" />

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 border-0"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </Button>
        </div>
      )}

      {/* Content Info - Bottom Left */}
      <div className="absolute bottom-4 left-4 right-20 text-white z-10">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {video.userId.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              @{video.userId.email.split("@")[0]}
            </p>
            <p className="text-xs text-white/70">
              {formatTimeAgo(new Date(video.createdAt))}
            </p>
          </div>
        </div>

        {/* Video Title & Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
          <p className="text-sm text-white/90 line-clamp-3">
            {video.description}
          </p>
        </div>
      </div>

      {/* Action Buttons - Right Side */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-10">
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-12 h-12 rounded-full border-0 transition-all",
              isLiked
                ? "bg-red-500 hover:bg-red-600"
                : "bg-black/50 hover:bg-black/70"
            )}
            onClick={toggleLike}
          >
            <Heart
              className={cn(
                "w-6 h-6",
                isLiked ? "text-white fill-white" : "text-white"
              )}
            />
          </Button>
          <span className="text-xs text-white font-medium">
            {isLiked ? "1" : "0"}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border-0"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
          <span className="text-xs text-white font-medium">0</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border-0"
            onClick={handleShare}
          >
            <Share className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Sound Toggle */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border-0"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>

        {/* More Options */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border-0"
          >
            <MoreHorizontal className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
