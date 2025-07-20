"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  text: string;
  username: string;
  userid: string;
  createdAt: Date;
}

interface VideoPlayerProps {
  video: {
    _id: string;
    title: string;
    desciption: string;
    videourl: string;
    thumbnailurl: string;
    username: string;
    likes: number;
    likedBy?: string[];
    comments?: Comment[];
    views: number;
  };
  isActive: boolean;
  onVideoEnd?: () => void;
}

export function VideoPlayer({ video, isActive, onVideoEnd }: VideoPlayerProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const [comments, setComments] = useState<Comment[]>(video.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    if (session?.user?.email && video.likedBy) {
      setIsLiked(video.likedBy.includes(session.user.email));
    }
  }, [session, video.likedBy]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      videoElement.currentTime = 0;
      if (isPlaying) {
        videoElement.play();
      }
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please login to like videos",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/video/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: video._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likes);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Login required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsCommenting(true);
    try {
      const response = await fetch("/api/video/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video._id,
          comment: newComment.trim(),
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
        toast({
          title: "Comment added!",
          description: "Your comment has been posted",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: video.title,
        text: video.desciption,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Video link copied to clipboard",
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videourl}
        poster={video.thumbnailurl}
        className="w-full h-full object-cover sm:object-contain lg:object-cover"
        loop
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        onEnded={onVideoEnd}
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="lg"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            onClick={togglePlay}
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="flex items-end justify-between">
          {/* Video Info */}
          <div className="flex-1 pr-4 max-w-[calc(100%-80px)] sm:max-w-[calc(100%-100px)]">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white">
                <AvatarImage src="" />
                <AvatarFallback className="bg-purple-600 text-white text-xs sm:text-sm">
                  {video.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-xs sm:text-sm">
                  @{video.username}
                </p>
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm sm:text-lg mb-2 line-clamp-2">
              {video.title}
            </h3>

            {video.desciption && (
              <p className="text-white/90 text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-3">
                {video.desciption}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="lg"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                onClick={handleLike}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isLiked ? "text-red-500 fill-red-500" : "text-white"
                  }`}
                />
              </Button>
              <span className="text-white text-xs text-center font-medium mt-1">
                {likesCount.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="lg"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </Button>
              <span className="text-white text-xs text-center font-medium mt-1">
                {comments.length}
              </span>
            </div>

            <Button
              variant="ghost"
              size="lg"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/80 backdrop-blur-md border-l border-white/20">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">Comments</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                        {comment.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {comment.username}
                      </p>
                      <p className="text-white/90 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            {session && (
              <div className="p-4 border-t border-white/20">
                <form onSubmit={handleComment} className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    disabled={isCommenting}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isCommenting}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
