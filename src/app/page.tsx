import Article from "@/components/Articles/Article";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions, getAuthSession } from "./api/auth/[...nextauth]/route";
import { useSearchTextStore } from "../../store/useSearchTextStore";
import Feed from "@/components/feed/Feed";

const fetchPosts = async () => {
  try {
    const res = await fetch(`https://blog-story.vercel.app/api/post/fetch`, {
      cache: "no-store",
    });
    const data = await res.json();
    console.log(data.posts.length);

    return data.posts;
  } catch (error) {
    console.log(error);
  }
};

export default async function Home() {
  const data = await fetchPosts();

  return (
    <main className=" p-5  xl:w-[65%]">
      <link rel="icon" href="favicon.ico" sizes="any" />
      <CategoryBar />

      <Feed data={data} />
    </main>
  );
}
