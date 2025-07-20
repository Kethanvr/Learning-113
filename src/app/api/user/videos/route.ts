import { authOptions } from "@/lib/auth";
import { conntodb } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await conntodb();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    const videos = await Video.find({ userid: email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch user videos" },
      { status: 500 }
    );
  }
}
