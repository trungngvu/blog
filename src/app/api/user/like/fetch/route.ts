import { dbConnection } from "@/utills/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../../../models/postModel";
import User from "../../../../../../models/userModels";

export const GET = async (request: NextRequest) => {
  const id: string = request.nextUrl.searchParams.get("id") || "";

  try {
    await dbConnection();
    const data = await User.findById(id).populate({
      path: "like",
      model: Post,
    });

    return NextResponse.json({ data: data.like }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};
