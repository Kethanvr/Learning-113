import { conntodb } from "@/lib/db";
import Video, { Ivideo, VIDEO_DIMENSION } from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// GET a specific video by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await conntodb();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await Video.findById(id).lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Video fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// UPDATE a specific video by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await conntodb();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const body: Partial<Ivideo> = await request.json();

    // Find the video and check ownership
    const existingVideo = await Video.findById(params.id);
    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (existingVideo.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own videos" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: Partial<Ivideo> = {};

    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.videourl) updateData.videourl = body.videourl;
    if (body.thumbnailurl) updateData.thumbnailurl = body.thumbnailurl;
    if (body.controls !== undefined) updateData.controls = body.controls;

    if (body.transformation) {
      updateData.transformation = {
        height: body.transformation.height || VIDEO_DIMENSION.height,
        width: body.transformation.width || VIDEO_DIMENSION.width,
        quality: body.transformation.quality || 100,
      };
    }

    const updatedVideo = await Video.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedVideo, { status: 200 });
  } catch (error) {
    console.error("Video update error:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE a specific video by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await conntodb();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    // Find the video and check ownership
    const existingVideo = await Video.findById(params.id);
    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (existingVideo.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own videos" },
        { status: 403 }
      );
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
