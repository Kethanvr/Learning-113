import { authOptions } from "@/lib/auth";
import { conntodb } from "@/lib/db";
import Video, { Ivideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await conntodb();

    const { searchParams } = new URL(request.url);
    const trending = searchParams.get("trending");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let query = Video.find({});

    if (trending === "true") {
      // Sort by likes and views for trending
      query = query.sort({ likes: -1, views: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Get total count for pagination
    const totalVideos = await Video.countDocuments(query.getFilter());

    const videos = await query
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(totalVideos / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      videos,
      pagination: {
        currentPage: page,
        totalPages,
        totalVideos,
        hasNext,
        hasPrev,
        limit,
      },
    });
  } catch (error) {
    console.error("Video fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await conntodb();

    const body: Ivideo = await request.json();
    if (
      !body.title ||
      !body.desciption ||
      !body.videourl ||
      !body.thumbnailurl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        width: 400,
        height: 600,
        crop: "maintain_ratio",
      },
    };

    const newVideo = new Video(videoData);
    await newVideo.save();

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error saving video:", error);
    return NextResponse.json(
      { error: "Failed to save video" },
      { status: 500 }
    );
  }
}
