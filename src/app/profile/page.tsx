"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Video,
  Heart,
  Eye,
  Calendar,
  Edit3,
  Share2,
  Grid3X3,
  Play,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

interface UserVideo {
  _id: string;
  title: string;
  desciption: string;
  videourl: string;
  thumbnailurl: string;
  likes: number;
  views: number;
  createdAt: string;
}

interface UserStats {
  totalVideos: number;
  totalLikes: number;
  totalViews: number;
  joinedDate: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userVideos, setUserVideos] = useState<UserVideo[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos");

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/login");
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user videos
      const videosResponse = await fetch(
        `/api/user/videos?email=${session?.user?.email}`
      );
      if (videosResponse.ok) {
        const videos = await videosResponse.json();
        setUserVideos(videos);

        // Calculate stats
        const stats = {
          totalVideos: videos.length,
          totalLikes: videos.reduce(
            (sum: number, video: UserVideo) => sum + (video.likes || 0),
            0
          ),
          totalViews: videos.reduce(
            (sum: number, video: UserVideo) => sum + (video.views || 0),
            0
          ),
          joinedDate:
            videos.length > 0
              ? videos[videos.length - 1].createdAt
              : new Date().toISOString(),
        };
        setUserStats(stats);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl font-bold">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {session?.user?.name || "Anonymous User"}
                </h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Creator
                  </Badge>
                  {userStats && userStats.totalVideos >= 10 && (
                    <Badge
                      variant="outline"
                      className="bg-gold-50 text-yellow-700 border-yellow-200"
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Active Creator
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6 max-w-2xl">
                {session?.user?.email}
              </p>

              {/* Stats */}
              {userStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {userStats.totalVideos}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Videos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {userStats.totalLikes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Likes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {userStats.totalViews.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {new Date(userStats.joinedDate).getFullYear()}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      Joined
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-2xl p-1">
            <TabsTrigger
              value="videos"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Videos ({userVideos.length})
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-8">
            {userVideos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start creating amazing content and share it with the world!
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Upload Your First Video
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userVideos.map((video) => (
                  <Card
                    key={video._id}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative aspect-[9/16] overflow-hidden">
                      <video
                        src={video.videourl}
                        poster={video.thumbnailurl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {video.likes || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {video.views || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No liked videos yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start exploring and liking videos that inspire you!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Welcome to my ReelsPro profile! I'm passionate about
                      creating and sharing amazing video content. Join me on
                      this creative journey and let's make something incredible
                      together.
                    </p>
                  </div>

                  {userStats && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Journey Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Member since
                              </div>
                              <div className="font-semibold text-gray-900">
                                {new Date(
                                  userStats.joinedDate
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Video className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Content created
                              </div>
                              <div className="font-semibold text-gray-900">
                                {userStats.totalVideos} videos
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <Skeleton className="h-6 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[9/16] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
