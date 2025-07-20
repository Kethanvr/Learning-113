import { conntodb } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET videos for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await conntodb();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [videos, totalCount] = await Promise.all([
      Video.find({ userId: session.user.id })
        .sort({ createdAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Video.countDocuments({ userId: session.user.id }),
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
    console.error("User videos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user videos" },
      { status: 500 }
    );
  }
}
