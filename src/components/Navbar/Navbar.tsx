"use client";
import Logo from "@/Icons/Logo";
import React, { useState } from "react";
import SearchBar from "../Search/SearchBar";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Menu from "@/Icons/Menu";
import WriteButton from "./WriteButton";

import Link from "next/link";
import Logout from "../Articles/Icons/Logout";
import Profile from "../Articles/Icons/Profile";
import About from "../Articles/Icons/About";
import Developer from "../Articles/Icons/Developer";
import { useRouter } from "next/navigation";
import Edit from "../Articles/Icons/Edit";
import Search from "@/Icons/Search";

const Navbar = () => {
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  const [searchShow, setSearchShow] = useState(false);

  const openDropDown = () => {
    setOpen(!open);
  };

  const onLogin = () => {
    signIn("google");
  };

  return (
    <div className="fixed top-0 z-50 flex items-center justify-between h-16 min-w-full p-5 duration-300 ease-in-out bg-white shadow-lg translate md:p-10">
      <div className={`${searchShow ? "flex" : "hidden"}`}>
        {" "}
        <SearchBar />
      </div>

      <Link
        className={`${searchShow ? "hidden" : "flex"} flex items-center gap-2 `}
        href="/"
      >
        {" "}
        <Logo />
        <span className="text-lg font-bold md:text-xl">Story</span>
      </Link>

      <div className="flex gap-3">
        {!data?.user ? (
          <>
            <button
              className="p-2 px-3 text-white bg-black rounded-2xl"
              onClick={onLogin}
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative flex items-center justify-between h-full gap-3 md:gap-5">
            <div
              onClick={() => setSearchShow(!searchShow)}
              className="cursor-pointer "
            >
              <Search />
            </div>
            <div className="hidden md:flex">
              {" "}
              <WriteButton />
            </div>

            <Link className="md:hidden" href="/uploadbutton/create">
              <Edit />
            </Link>

            <div className="flex justify-center gap-2 " onClick={openDropDown}>
              <Image
                src={data.user.image as string}
                alt="user"
                width={35}
                height={35}
                className="rounded-full"
              />
              <Menu />
            </div>
            {open ? <DropDown /> : ""}
          </div>
        )}
      </div>
    </div>
  );
};

const DropDown = () => {
  const { data }: any = useSession();
  const router = useRouter();
  const items = [
    {
      id: 1,
      text: "Profile",
      icon: <Profile />,
      path: `/profile/${data?.user?.id}`,
    },
    {
      id: 2,
      text: "Log out",
      icon: <Logout />,
    },
  ];

  return (
    <div className="absolute right-0 w-56 p-5 bg-white border rounded-md shadow-xl h-34 top-14">
      {items.map((d: any) => (
        <div
          className="flex items-center gap-5 p-2 mb-5 text-base font-medium rounded-md cursor-pointer hover:bg-slate-300"
          key={d.id}
          onClick={() =>
            d.text === "Log out" ? signOut() : router.push(d.path)
          }
        >
          {d.icon}
          <button> {d.text}</button>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
