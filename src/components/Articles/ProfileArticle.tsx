"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileArticle = ({ d }: { d: any }) => {
  const router = useRouter();
  return (
    <div className="p-3 mt-5 shadow-md" key={d._id}>
      <div
        className="items-center justify-between hidden w-full gap-4 cursor-pointer  md:flex"
        onClick={() => router.push(`/post/${d._id}`)}
      >
        <div>
          {" "}
          <h1 className="mt-4 text-lg font-semibold">{d.title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            {d.content.replace(/<[^>]*>/g, "").slice(0, 350)}
          </p>
        </div>
        <img src={d.image} className="rounded-lg w-52 h-36" />
      </div>
    </div>
  );
};

export default ProfileArticle;
