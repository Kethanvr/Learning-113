import User from "@/models/user";
import { conntodb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    }

    await conntodb();

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 }
      );
    }

    await User.create({ email, password });
    return NextResponse.json(
      { message: "user created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "user failed to register" },
      { status: 500 }
    );
  }
}
