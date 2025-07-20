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

    const { videoId, comment } = await request.json();

    if (!videoId || !comment?.trim()) {
      return NextResponse.json(
        { error: "Video ID and comment required" },
        { status: 400 }
      );
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Initialize comments array if it doesn't exist
    if (!video.comments) {
      video.comments = [];
    }

    const newComment = {
      id: Date.now().toString(),
      text: comment.trim(),
      username: session.user?.name || session.user?.email || "Anonymous",
      userid: session.user?.email,
      createdAt: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await conntodb();

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    const video = await Video.findById(videoId).select("comments").lean();
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video.comments || []);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
