import { conntodb } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await conntodb();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 }
      );
    }

    // Search videos by title and description
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desciption: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Extract unique usernames
    const users = [...new Set(videos.map((video) => video.username))];

    // Generate hashtags (basic implementation)
    const hashtags = [
      `#${query.toLowerCase()}`,
      `#${query.toLowerCase()}video`,
      `#trending${query.toLowerCase()}`,
    ];

    return NextResponse.json({
      videos,
      users,
      hashtags,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
