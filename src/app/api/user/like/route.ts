import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnection } from "@/utills/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../../models/postModel";
import User from "../../../../../models/userModels";

export const PUT = async (request: NextRequest) => {
  const data = await request.json();

  try {
    await dbConnection();
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
    }
    await User.findOneAndUpdate(
      {
        _id: session.user.id,
      },
      {
        $push: {
          like: data.food,
        },
      }
    );

    return NextResponse.json(
      {
        message: "Updated Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
};


