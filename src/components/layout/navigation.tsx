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
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
      active: pathname === "/search",
    },
    {
      name: "Upload",
      icon: PlusCircle,
      onClick: () => setIsUploadOpen(true),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="flex items-center gap-2">
              <Play className="w-8 h-8 text-black" />
              <span className="text-xl font-bold text-black">ReelsPro</span>
            </Link>
          </div>

          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        item.active
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-black"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-6 w-6",
                          item.active
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-600"
                        )}
                      />
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      <item.icon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-600" />
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* User Profile Section */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-2 py-2"
                  >
                    <Avatar className="w-8 h-8 mr-3">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {session?.user?.name?.[0] ||
                          session?.user?.email?.[0] ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigationItems.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                    item.active
                      ? "text-white bg-black"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors w-full"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <VideoUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Main content padding for mobile */}
      <div className="md:hidden pb-20" />
    </>
  );
}
