"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DropDown from "../DropDown/DropDown";
import dataMenu from "../../app/swipe/menu.json";

const CategoryBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  let convertedStr = "";
  if (pathname != "/") {
    convertedStr =
      pathname.split("/")[2].charAt(0).toUpperCase() +
      pathname.split("/")[2].slice(1);
  }

  const [data, setData] = useState<any[]>([{ id: 0, label: "All", path: "/"}]);
  useEffect(() => {
    setData((prev => [...prev, ...dataMenu.map((item, index) => ({ id: index+1, label: item.food, path: `/category/${item.food.toLowerCase()}` }))]));
  }, []);

  const people = [
    { name: "Home", path: "/" },
    { name: "Sports", path: "/category/sports" },
    { name: "Entertainment", path: "/category/science" },
    { name: "Science", path: "/category/technology" },
    { name: "Space", path: "/category/space" },
  ];
  const [selected, setSelected] = useState(people[0]);
  return (
    <>
      <div className="flex-col items-center justify-center hidden gap-5 mt-5 font-normal bg-white xl:flex xl:min-w-full">
        <div className="flex gap-5 overflow-x-scroll max-w-full px-5">
          {data.map((item) => (
            <Link
              href={item.path}
              key={item.id}
              className={`whitespace-nowrap ${
                item.label === "Home"
                  ? "font-extrabold"
                  : item.label === convertedStr
                  ? "font-extrabold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="h-[1px] bg-black min-w-[100%] "> </div>
      </div>

      <div className="flex justify-between xl:hidden">
        <select
          name=""
          id=""
          className="p-2 text-xs rounded-lg shadow-lg bg-teal-50"
        >
          {data.map((item) => (
            <option key={item.id} onClick={() => router.push(item.path)}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default CategoryBar;
