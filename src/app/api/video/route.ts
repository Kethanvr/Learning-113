import { conntodb } from "@/lib/db";
import Video from "@/modles/Video";
import { NextResponse } from "next/server";
import User from "@/modles/user";
import { error } from "console";

export async function GET() {
  try {
    await conntodb();
    const videos = await Video.find().lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], {
        status: 200,
      });
    }
    return NextResponse.json(
      {
        videos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "failed to fetch vidoes go back and check",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await conntodb();
    const user = await User.findOne().lean();

    if (!User) {
      return NextResponse.json(
        { error: "user not found in db" },
        { status: 500 }
      );

      
    }
  } catch (error) {}
}
