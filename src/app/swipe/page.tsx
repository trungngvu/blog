"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";

const fetchPosts = async () => {
  try {
    const res = await fetch(`api/post/fetch`, {
      cache: "no-store",
    });
    const data = await res.json();
    console.log(data.posts.length);

    return data.posts;
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line @next/next/no-async-client-component
function Advanced() {
  const [db, setDb] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  useEffect(() => {
    fetchPosts().then((data) => setDb(data));
  }, []);
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
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

  return (
    <div className="flex flex-col items-center xl:w-[70%] grow xl:grow-0 pt-10 gap-5">
      <h1 className="text-xl font-bold">Lựa chọn quán ăn</h1>
      <div className="cardContainer">
        {db?.map((character, index) => (
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
      <div className="buttons">
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("left")}
        >
          Swipe left!
        </button>
        <button
          style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("right")}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
}

export default Advanced;