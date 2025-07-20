"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  Flame,
  Users,
  Hash,
  Play,
  Heart,
  Eye,
  Filter,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface Video {
  _id: string;
  title: string;
  desciption: string;
  videourl: string;
  thumbnailurl: string;
  username: string;
  likes: number;
  views: number;
  createdAt: string;
}

interface SearchResult {
  videos: Video[];
  users: string[];
  hashtags: string[];
}

const TRENDING_HASHTAGS = [
  "#viral",
  "#funny",
  "#dance",
  "#music",
  "#trending",
  "#comedy",
  "#art",
  "#food",
  "#travel",
  "#fitness",
  "#education",
  "#gaming",
];

const POPULAR_CATEGORIES = [
  { name: "Comedy", icon: "😂", count: "1.2M" },
  { name: "Music", icon: "🎵", count: "950K" },
  { name: "Dance", icon: "💃", count: "800K" },
  { name: "Food", icon: "🍔", count: "650K" },
  { name: "Travel", icon: "✈️", count: "500K" },
  { name: "Art", icon: "🎨", count: "400K" },
];

export default function SearchPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    videos: [],
    users: [],
    hashtags: [],
  });
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    fetchTrendingVideos();
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      10
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/video?trending=true&limit=20");
      if (response.ok) {
        const videos = await response.json();
        setTrendingVideos(videos);
      }
    } catch (error) {
      console.error("Error fetching trending videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setActiveTab("results");
      saveRecentSearch(query);

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Discover Amazing Content
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find trending videos, discover new creators, and explore what's
              popular right now
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for videos, creators, or hashtags..."
                className="pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:ring-black"
              />
              <Button
                onClick={() => handleSearch()}
                disabled={!searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white rounded-lg"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && activeTab === "discover" && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Recent Searches
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 px-3 py-1"
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch(search);
                    }}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-2xl p-1 mb-8">
            <TabsTrigger
              value="discover"
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <Flame className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            <div className="space-y-8">
              {/* Popular Categories */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Hash className="w-6 h-6 text-purple-600" />
                    Popular Categories
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {POPULAR_CATEGORIES.map((category, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          setSearchQuery(category.name.toLowerCase());
                          handleSearch(category.name.toLowerCase());
                        }}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {category.count} videos
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Hashtags */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Hash className="w-6 h-6 text-purple-600" />
                    Trending Hashtags
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {TRENDING_HASHTAGS.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 px-4 py-2 text-sm"
                        onClick={() => {
                          setSearchQuery(hashtag);
                          handleSearch(hashtag);
                        }}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <Skeleton className="aspect-[9/16] bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                      <Skeleton className="h-3 w-2/3 bg-gray-200" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full bg-gray-200" />
                        <Skeleton className="h-3 w-16 bg-gray-200" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 bg-gray-200" />
                            <Skeleton className="w-6 h-3 bg-gray-200" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 bg-gray-200" />
                            <Skeleton className="w-8 h-3 bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingVideos.map((video, index) => (
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
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black text-white border-0">
                          <Flame className="w-3 h-3 mr-1" />#{index + 1}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-300 mb-2">
                          @{video.username}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {(video.likes || 0).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {(video.views || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <Skeleton className="aspect-[9/16] bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                      <Skeleton className="h-3 w-2/3 bg-gray-200" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full bg-gray-200" />
                        <Skeleton className="h-3 w-16 bg-gray-200" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 bg-gray-200" />
                            <Skeleton className="w-6 h-3 bg-gray-200" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Skeleton className="w-4 h-4 bg-gray-200" />
                            <Skeleton className="w-8 h-3 bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.videos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try searching with different keywords or explore trending
                  content instead.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results for "{searchQuery}"
                  </h2>
                  <div className="text-gray-600">
                    {searchResults.videos.length} videos found
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.videos.map((video) => (
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
                          <p className="text-xs text-gray-300 mb-2">
                            @{video.username}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {(video.likes || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {(video.views || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
