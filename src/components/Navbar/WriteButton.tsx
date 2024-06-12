import Write from "@/Icons/Write";
import { IoMdHeart } from "react-icons/io";
import Link from "next/link";
import React from "react";

const WriteButton = () => {
  return (
    <div className="flex gap-4">
      <Link
        href="/uploadbutton/create"
        className="rounded-lg border border-black   p-2  text-xs flex items-center text-black gap-1 "
      >
        Write
        <Write />
      </Link>
      <Link
        href="/favorite"
        className="rounded-lg border border-black   p-2  text-xs flex items-center text-black gap-1 "
      >
        Favorite
        <IoMdHeart width={18} height={18} />
      </Link>
    </div>
  );
};

export default WriteButton;
