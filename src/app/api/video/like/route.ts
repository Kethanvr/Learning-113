import { authOptions } from "@/lib/auth";
import { conntodb } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await conntodb();

    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Initialize likedBy array if it doesn't exist
    if (!video.likedBy) {
      video.likedBy = [];
    }

    const userId = session.user?.email;
    const isLiked = video.likedBy.includes(userId);

    if (isLiked) {
      // Unlike
      video.likedBy = video.likedBy.filter((id: string) => id !== userId);
      video.likes = Math.max(0, (video.likes || 0) - 1);
    } else {
      // Like
      video.likedBy.push(userId);
      video.likes = (video.likes || 0) + 1;
    }

    await video.save();

    return NextResponse.json({
      liked: !isLiked,
      likes: video.likes,
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to like video" },
      { status: 500 }
    );
  }
}
