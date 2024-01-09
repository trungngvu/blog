import CommentSection from "@/components/Comment/CommentSection";
import axios from "axios";
import Image from "next/image";
import React from "react";

const fetchSingelPost = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_URL}/api/post/fetch?id=${id}`
    );
    return data?.posts;
  } catch (error) {
    console.log(error);
  }
};

const SinglePost = async ({ params }: { params: { slug: string } }) => {
  const data = await fetchSingelPost(params.slug);

  return (
    <main className="text-black p-10 shadow-md w-[65%]">
      <h1 className="text-3xl font-medium">{data?.title}</h1>
      <p className="mt-1 text-sm">
        {new Date(data?.createdAt).toLocaleString()}
      </p>
      <div className="flex items-center gap-2 mt-5 cursor-pointer ">
        <Image
          src={data?.author.avatar}
          width={35}
          height={35}
          alt="avatar"
          className="rounded-full"
        />
        <div>
          <h1 className="text-sm font-medium">{data?.author.name}</h1>
          <p className="text-xs ">{data?.author.slug}</p>
        </div>
      </div>
      <img
        src={data?.image}
        className="mt-3 w-[80%] rounded-md mb-5"
        alt="image"
      />

      <div
        className="w-[90%] text-justify font-normal text-lg mt-14"
        dangerouslySetInnerHTML={{ __html: data?.content }}
      />

      <hr className="mt-16 font-extrabold" />
      <CommentSection id={params.slug} post={data} />
    </main>
  );
};

export default SinglePost;
