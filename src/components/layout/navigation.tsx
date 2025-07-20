"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  Search,
  PlusCircle,
  User,
  Play,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoUpload } from "@/components/video/video-upload";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleUploadSuccess = () => {
    // Refresh the page or update the feed
    window.location.reload();
  };

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 md:hidden",
          className
        )}
      >
        <div className="flex items-center justify-around h-16 px-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-2"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-1 h-auto py-2"
            onClick={() => setIsUploadOpen(true)}
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Upload</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-col gap-1 h-auto py-2"
              >
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 bg-background/95 backdrop-blur-md border-r border-border/50 w-64 hidden md:flex flex-col",
          className
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold">ReelsPro</h1>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Home className="w-5 h-5" />
                Home
              </Button>
            </Link>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Search className="w-5 h-5" />
              Search
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => setIsUploadOpen(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Upload Video
            </Button>

            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="w-5 h-5" />
                Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate">
                    @{session.user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Upload Modal */}
      <VideoUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
}
