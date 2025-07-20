import { conntodb } from "@/lib/db";
import Video, { Ivideo, VIDEO_DIMENSION } from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await conntodb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const userId = searchParams.get("userId");

    const skip = (page - 1) * limit;

    // Build query
    const query = userId ? { userId } : {};

    const [videos, totalCount] = await Promise.all([
      Video.find(query)
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit)
        .populate("userId", "email") // Populate user info
        .lean(),
      Video.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        videos,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "unauthorized" },
        {
          status: 401,
        }
      );
    }

    await conntodb();

    const body: Partial<Ivideo> = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videourl ||
      !body.thumbnailurl
    ) {
      return NextResponse.json(
        {
          error: "title, description, videourl, and thumbnailurl are required",
        },
        {
          status: 400,
        }
      );
    }

    const videodata = {
      ...body,
      userId: session.user.id,
      controls: body?.controls ?? true,
      transformation: {
        height: body.transformation?.height || VIDEO_DIMENSION.height,
        width: body.transformation?.width || VIDEO_DIMENSION.width,
        quality: body.transformation?.quality || 100,
      },
    };

    const newVideo = await Video.create(videodata);

    return NextResponse.json(newVideo, {
      status: 201,
    });
  } catch (error) {
    console.error("Video creation error:", error);
    return NextResponse.json(
      { error: "failed to create video" },
      { status: 500 }
    );
  }
}
