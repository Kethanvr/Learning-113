import User from "@/modles/user";
import { conntodb } from "@/lib/db";
import { NextServer } from "next/dist/server/next";
import { NextRequest, NextResponse } from "next/server";
import { error } from "console";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are missing" },
        {
          status: 400,
        }
      );

      await conntodb();

      const existinguser = await User.findOne({ email });
      if (existinguser) {
        return NextResponse.json({ error: "user exist " }, { status: 400 });
      }

      await User.create({ email, password });
      return NextResponse.json({ message: "user created " }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "user failed to register  " },
      { status: 400 }
    );
  }
}
