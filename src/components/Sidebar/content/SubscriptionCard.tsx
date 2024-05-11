"use client";
import Reder from "@/Icons/Reder";
import React from "react";
import Lottie from "lottie-react";
import alien from "../../../Animation/json/alien.json";
import Animation from "@/Animation/Animation";
const SubscriptionCard = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: alien,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="flex items-center justify-between max-w-sm p-5 rounded-lg shadow-md bg-slate-100">
      <div>
        <h1 className="font-semibold">
          Get unlimited access to everything on Story
        </h1>
        <p className="mt-2 text-xs">
          Get access to millions of exclusive stories
        </p>
        <button className="p-2 mt-3 text-sm transition-all duration-300 ease-in-out rounded-lg bg-slate-300 hover:bg-slate-400">
          Subscribe Now
        </button>
      </div>
      <div>
        <Animation animationData={alien} classes=""></Animation>
      </div>
    </div>
  );
};

export default SubscriptionCard;
