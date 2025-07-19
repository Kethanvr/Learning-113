import { conntodb } from "@/lib/db";
import Video, { Ivideo } from "@/modles/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "user not authorised" },
        {
          status: 500,
        }
      );
    }
    await conntodb();

    const body: Ivideo = await request.json();

    if (body.title || body.desciption || body.videourl || body.thumbnailurl) {
      return NextResponse.json(
        { error: "user not authorised" },
        {
          status: 500,
        }
      );
    }

    const videodata = {
      ...body,
      controls: body?.controls ?? true,
      transfortransformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality || 100,
      },
    };

     const newVideo = await Video.create(videodata);
     
    return NextResponse.json(newVideo,{
        status:200
    })
  } catch (error) {

    return NextResponse.json(

      { error: "user not found in db" },
      { status: 500 }
    ); 
  }
}
