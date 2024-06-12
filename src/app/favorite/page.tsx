"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Feed from "@/components/feed/Feed";

import axios from "axios";

const FavoritePage = () => {
  const session: any = useSession();
  const [data, setData] = useState<any>([]);
  console.log(data);

  useEffect(() => {
    if (session) {
      axios
        .get(`/api/user/like/fetch?id=${session?.data?.user?.id}`)
        .then(({ data }: any) => {
          const filteredData = data?.data?.filter(
            (item: any) => item.restaurantName
          );
          const uniqueRestaurantsMap = filteredData?.reduce(
            (acc: any, current: any) => {
              acc[current.restaurantName] = current;
              return acc;
            },
            {}
          );

          const uniqueArray = Object.values(uniqueRestaurantsMap);

          setData(
            uniqueArray.map((post: any) => {
              return {
                ...post,
                title: post.restaurantName,
                content: post.address,
              };
            })
          );
        });
    }
  }, [session]);

  return (
    <main className="p-5 xl:w-[65%]">
      <Feed data={data || []} />
    </main>
  );
};

export default FavoritePage;
