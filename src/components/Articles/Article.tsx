/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Like from "./Icons/Like";
import Share from "./Icons/Share";
import Comments from "./Icons/Comments";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginModalStore } from "../../../store/LoginModalStore";
import Edit from "./Icons/Edit";
import Delete from "./Icons/Delete";
import Link from "next/link";
import Liked from "./Icons/Liked";
import { RequestSuccessStore } from "../../../store/RequestSuccessStore";

const Article = ({ props }: { props: any }) => {
  const { data }: any = useSession();

  const requestSuccessStore: any = RequestSuccessStore();

  const loginModal: any = LoginModalStore();
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(props.likes.length);

  useEffect(() => {
    setIsLiked(props.likes?.includes(data?.user?.id) ? true : false);
    setLike(props.likes.length);
  }, [props.likes, data?.user?.id]);

  const onLiked = async () => {
    if (!data) {
      loginModal.setOpen();
      return;
    }

    setIsLiked(!isLiked);
    setLike(!isLiked ? like + 1 : like - 1);

    try {
      await axios.put(`api/post/like?id=${props._id}`);
      alert("liked");
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const onDelete = async () => {
    alert("Are you sure you want to delete");
    await axios
      .delete(`api/post/delete?id=${props._id}`)
      .then(() => {
        window.location.reload();
        alert("Deleted");
        router.refresh();
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="p-5 mt-4 transition-all duration-300 ease-in-out bg-white shadow-lg cursor-pointer hover:shadow-2xl">
      <div className="flex items-center gap-3">
        <Image
          src={props?.author?.avatar}
          alt="user"
          height={30}
          width={30}
          className="rounded-full"
        />

        <div className="">
          <Link
            href={`/profile/${props.author.id}`}
            className="text-sm font-bold cursor-pointer hover:underline"
          >
            {props?.author.name}
          </Link>
          <p className="text-xs tracking-wider">{props?.author?.slug}</p>
        </div>
      </div>

      <div
        className="items-center justify-between hidden w-full gap-4 md:flex"
        onClick={() => router.push(`/post/${props._id}`)}
      >
        <div>
          {" "}
          <h1 className="mt-4 text-lg font-semibold">{props.title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            {props.content.replace(/<[^>]*>/g, "").slice(0, 350)}
          </p>
        </div>
        <img src={props.image} className="rounded-lg w-52 h-36" />
      </div>
      <div className="mt-5 md:hidden">
        <img
          src={props.image}
          className="w-full rounded-lg"
          onClick={() => router.push(`/post/${props._id}`)}
        />

        <div onClick={() => router.push(`/post/${props._id}`)}>
          {" "}
          <h1 className="mt-4 text-lg font-semibold">{props.title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            {props.content.replace(/<[^>]*>/g, "").slice(0, 200)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 ">
        <div className="flex items-center gap-4 ">
          <div className="p-2 text-xs font-semibold bg-teal-100 rounded-full max-w-fit">
            {props.category}{" "}
          </div>
          <div className="hidden p-2 text-xs font-semibold bg-red-100 rounded-full max-w-fit md:flex">
            4 min read{" "}
          </div>
        </div>
        <div className="flex items-center gap-5 md:gap-8">
          {" "}
          {props.author.id === data?.user.id ? (
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <Delete onClick={onDelete} />
              <Link href={`/uploadbutton/update-${props._id}`}>
                {" "}
                <Edit />
              </Link>
            </div>
          ) : (
            ""
          )}
          <Share />
          <div className="flex items-center justify-center gap-1">
            {" "}
            <Comments />
            <p className="text-sm text-slate-500">{props.comments.length}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            {isLiked ? <Liked onClick={onLiked} /> : <Like onClick={onLiked} />}
            <p className="text-sm text-slate-500">{like}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
