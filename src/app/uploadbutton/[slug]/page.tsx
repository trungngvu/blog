"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import Select from "react-select";
import { UploadButton } from "../../../utills/uploadthing";

import { use, useEffect, useState } from "react";
import DropDown from "@/components/DropDown/DropDown";
import Editor from "@/components/Quill";
import { title } from "process";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const people = [
  { name: "Food" },
  { name: "Drinks" },
  { name: "Rice" },
  { name: "Noodles" },
  { name: "Bread" },
  { name: "Porridge" },
];



export default function Home() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(people[0]);
  const [btn, setButton] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isUpdate, setIsUpdate] = useState(false);
  const [postCoor, setPostCoor] = useState([]);

  const [data, setData] = useState({
    title: "",
    coordinates: "",
    content: "",
    image: "",
  });

 useEffect(() => {
  const fetchData = async (id: string) => {
    try {
      const posts = await fetch(`https://blog-story.vercel.app/api/post/fetch?id=${id}`, {
        cache: "no-store",
      });
      const data = await posts.json();

      if (data) {
        setData({
          title: data.posts.title,
          coordinates: data.posts.coordinates,
          content: data.posts.content,
          image: data.posts.image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (pathname.split("/")[2].includes("update")) {
    const id = pathname.split("/")[2].split("-")[1];
    setIsUpdate(true);
    fetchData(id.toString());
  }

  }, [pathname]);

  // get full post data
  useEffect(() => {
    const fetchPosts = async () => {
    try {
      const res = await fetch(`https://blog-story.vercel.app/api/post/fetch`, {
        cache: "no-store",
      });
      const data = await res.json();

      setPostCoor(data.posts.map((post) => ({
        label: post.coordinates,
        value: post.coordinates,
      })));
    } catch (error) {
      console.log(error);
    }}

    fetchPosts();

  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const response = await axios
      .post("/api/post/create", { ...data, category: selected.name })
      .then(() => {
        setLoading(false);
        router.refresh();
        router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleUpdate = async () => {
    setLoading(true);

    const response = await axios
      .post("/api/post/update", { ...data, category: selected.name })
      .then(() => {
        setLoading(false);
        router.refresh();
        router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });

  };

  return (
    <main className="flex min-h-screen w-full xl:w-[70%]    flex-col p-5  sm:p-10   lg:p-24">
      <h1 className="w-full mb-5 font-bold text-left text-black">
        {pathname.split("/")[2] === "create"
          ? "Create a Post"
          : "Update a Post"}
      </h1>
      <div className="w-full h-[1px] bg-gray-500"></div>
      <div className="w-full p-5 shadow-xl">
        <DropDown
          selected={selected}
          setSelected={setSelected}
          people={people}
          name={selected?.name}
        />

        <div className="mt-5 ">
          <input
            type="text"
            name={data.title}
            value={data.title}
            className="w-full p-2 text-xs border rounded-lg md:text-lg focus:outline-none border-slate-500"
            placeholder="Enter title.. "
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
          <input
            type="text"
            name={data.coordinates}
            value={data.coordinates}
            className="w-60 mt-5 mr-5 p-2 text-xs border rounded-lg md:text-lg focus:outline-none border-slate-500"
            placeholder="Enter coordinates.."
            onChange={(e) => setData({ ...data, coordinates: e.target.value })}
          />
          <Select
            value={data.coordinates}
            onChange={(e) => setData({ ...data, coordinates: e.value })}
            options={postCoor}
            isClearable
            placeholder="Select coordinates..."
          />
          <span className="text-gray-400">Example: 105°48′00″E;21°02′00″N</span>
          <div className="w-full mt-5 mb-10 text-xs rounded-lg md:text-lg">
            <Editor onChange={(e) => setData({ ...data, content: e })} />
          </div>
          <div className="flex gap-12">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response

                setData({ ...data, image: res?.[0]?.fileUrl ?? "" });
                // alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <p className="p-3 mt-3 font-extrabold text-slate-500"> -- OR -- </p>
          <div>
            <input
              type="text"
              placeholder="Add image link here..."
              className="w-full p-2 mt-5 mb-6 text-xs rounded-md md:text-lg bg-slate-200 "
              name={data.image}
              value={data.image}
              onChange={(e) => setData({ ...data, image: e.target.value })}
            />
          </div>
          <div className="flex justify-center w-full">
            <button
              disabled={btn}
              type="button"
              onClick={isUpdate ? handleSubmit : handleUpdate}
              className={`${
                data.image.length == 0 ? "cursor-progress" : ""
              }text-black bg-slate-300 hover:bg-slate-400 focus:outline-none  font-medium rounded-full text-xs md:text-sm  px-5 py-2.5 w-[50%]  md:w-[30%] `}
            >
              {loading ? (
                <div className="flex items-center justify-center ">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="black"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <p>Creating..</p>
                </div>
              ) : pathname.split("/")[2] === "create" ? (
                "Create"
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
