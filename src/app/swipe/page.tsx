"use client";
import Link from "next/link";
import React, { useState, useMemo, useRef, useEffect, use } from "react";
import TinderCard from "react-tinder-card";
import data from "./menu.json";
import axios from "axios";

const fetchPosts = async () => {
  try {
    const res = await fetch(`api/post/fetch`, {
      cache: "no-store",
    });
    const data = await res.json();

    return data.posts;
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line @next/next/no-async-client-component
function Advanced() {
  const [db, setDb] = useState<any>([]);
  const [step, setStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  useEffect(() => {
    fetchPosts().then((data) => {
      setDb(data);
      setCurrentIndex(data.length - 1);
    });
  }, []);

  const currentIndexRef = useRef(currentIndex);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const childRefs = useMemo<any>(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    [db.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = async (direction: any, nameToDelete: any, index: number) => {
    if (direction === "right")
      await axios.put("/api/user/like", { food: db[index]._id });
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: any, idx: any) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < db.length) {
      if (dir === "right") await axios.put("/api/like", {});
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(data.map((item) => item?.food));
  }, []);

  const [selectedItemsName, setSelectedItemsName] = useState<string[]>([]);
  // useEffect(() => {
  //   console.log("selectedItems: ", db, selectedItems, list);

  //   setDb((prev: any) =>
  //     prev?.filter((e: any) =>
  //       selectedItems.map((i: number) => list[i].toLowerCase()).includes(e.category.toLowerCase())
  //     )
  //   );
  // }, [selectedItems]);

  const handleSubmitFilter = () => {
    setDb((prev: any) =>
      prev?.filter((e: any) =>
        selectedItems
          .map((i: number) => list[i].toLowerCase())
          .includes(e.category.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setCurrentIndex(db.length - 1);
  }, [db]);

  return (
    <div className="flex flex-col items-center xl:w-[70%] grow xl:grow-0 pt-10 gap-5">
      {step === 0 ? (
        <>
          <h1 className="text-xl font-bold">Interests</h1>
          <div className="flex flex-wrap gap-4 w-[400px]">
            {list.map((item, index) => (
              <div
                key={index}
                className={`p-3 border cursor-pointer border-slate-500 rounded-3xl text-slate-500 ${
                  selectedItems.includes(index) ? "bg-slate-500 text-white" : ""
                }`}
                onClick={() => {
                  setSelectedItems((prev: number[]) =>
                    prev.includes(index)
                      ? prev.filter((i: number) => i !== index)
                      : [...prev, index]
                  );
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="buttons">
            <button
              onClick={() => {
                setStep(1);
                handleSubmitFilter();
              }}
              style={{ backgroundColor: "blue", zIndex: 100 }}
            >
              Next!!
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold">Restaurant Finder</h1>
          <div className="cardContainer">
            {db?.map((character: any, index: any) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.title}
                onSwipe={(dir) => swiped(dir, character.title, index)}
                onCardLeftScreen={() => outOfFrame(character.title, index)}
              >
                <div
                  style={{ backgroundImage: "url(" + character.image + ")" }}
                  className="card"
                >
                  <h3>{character.title}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
          {/* <div className="buttons">
            <button
              style={{ backgroundColor: !canSwipe ? "#c3c4d3" : "" }}
              onClick={() => swipe("left")}
            >
              Swipe left!
            </button>

            <button
              style={{ backgroundColor: !canSwipe ? "#c3c4d3" : "" }}
              onClick={() => swipe("right")}
            >
              Swipe right!
            </button>
          </div> */}
          <div className="flex flex-col items-center">
            <div>Swipe card left to skip</div>
            <div>Swipe card right to add to favorite</div>
          </div>
          {db[currentIndex]?._id && (
            <div className="buttons">
              <Link href={`/post/${db[currentIndex]?._id}`} target="_blank">
                <button style={{ backgroundColor: "red" }}>See detail!!</button>
              </Link>
            </div>
          )}
          {lastDirection ? (
            <h2 key={lastDirection} className="infoText">
              You swiped {lastDirection}
            </h2>
          ) : (
            <h2 className="infoText">
              Swipe a card or press a button to get Restore Card button visible!
            </h2>
          )}
        </>
      )}
    </div>
  );
}

export default Advanced;
