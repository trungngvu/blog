import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";

interface props {
  avatar: string;
  name: string;
  date: string;
  comment: string;
  _id: string;
}

const CommentCard = ({
  props,
  postid,
  author,
}: {
  props: props;
  postid: string;
  author: string;
}) => {
  const { data }: any = useSession();
  console.log("data", data);

  const router = useRouter();

  return (
    <div className="w-full gap-2 p-2 mb-10 ">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={props.avatar}
          alt="user"
          height={30}
          width={30}
          className="rounded-full"
        />

        <div className="">
          <h1 className="text-sm font-bold ">{props?.name}</h1>
          <p className="text-xs tracking-wider">{props?.date}</p>
        </div>
      </div>

      <div className="relative w-full p-3 border border-gray-300 rounded-md min-w-max">
        {props?.comment}
        {data?.user?.id === author && (
          <div
            className="absolute font-bold cursor-pointer right-5 top-2"
            onClick={async () => {
              try {
                const { data } = await axios.post(
                  `/api/post/comment?id=${postid}`,
                  {
                    id: props._id,
                  }
                );

                router.refresh();
              } catch (error) {
                alert(error);
              }
            }}
          >
            x
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
