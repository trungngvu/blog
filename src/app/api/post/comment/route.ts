import { dbConnection } from "@/utills/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Post from "../../../../../models/postModel";

export const PUT = async (request: NextRequest) => {
  const data = await request.json();

  const id: string = request.nextUrl.searchParams.get("id") || "";

  try {
    await dbConnection();
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
    }

    const post = await Post.findById(id);

    post.comments.push({
      user: session?.user?.id,
      name: session?.user?.name,
      avatar: session?.user?.image,
      comment: data.cmnt,
    });

    await post.save({ validateBeforeSave: false });

    return NextResponse.json(
      { post: "commented successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const data = await request.json();

  const id: string = request.nextUrl.searchParams.get("id") || "";

  try {
    await dbConnection();
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
    }

    const post = await Post.findById(id);
    const indexToDelete = post.comments.findIndex(
      (comment: any) => comment._id === data.id
    );
    post.comments.splice(indexToDelete + 1, 1);

    await post.save({ validateBeforeSave: false });

    return NextResponse.json(
      { post: "Deleted commented successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
