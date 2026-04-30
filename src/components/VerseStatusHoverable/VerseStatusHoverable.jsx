import { useState } from "react";
import Circle from "../Circle/Circle";
import "./VerseStatusHoverable.css";
import { useQuranStore } from "../../store/useQuranStore";

function ChangeStatusHoverable({ currentState, changeState, closeHoverable }) {
  return (
    <div className="changeStatusGrid">
      <Circle
        handleClick={() => {
          changeState("unmemorised");
          closeHoverable();
        }}
        colour="gray"
        active={currentState === "unmemorised"}
      />
      <Circle
        handleClick={() => {
          changeState("needs_revision");
          closeHoverable();
        }}
        colour="orange"
        active={currentState === "needs_revision"}
      />
      <Circle
        handleClick={() => {
          changeState("memorised");
          closeHoverable();
        }}
        colour="green"
        active={currentState === "memorised"}
      />
    </div>
  );
}

export default function VerseStatusHoverable({ chapterNumber, numVerses }) {
  const [statusHoverableShowing, setStatusHoverableShowing] = useState(0);
  const progress = useQuranStore((state) => state.progress);
  const updateVerse = useQuranStore((state) => state.updateVerse);

  const handleStatusHoverableClick = (verseNum) => {
    if (statusHoverableShowing === verseNum) {
      setStatusHoverableShowing(0);
    } else {
      setStatusHoverableShowing(verseNum);
    }
  };

  const getColour = (status) => {
    if (status === "memorised") {
      return "green";
    } else if (status === "needs_revision") {
      return "orange";
    } else {
      return "gray";
    }
  };

  const closeHoverable = (verseNum) => {
    if (statusHoverableShowing === verseNum) {
      setStatusHoverableShowing(0);
    }
  };

  return (
    <div className="versesHoverableGrid">
      {[...Array(numVerses).keys()].map((num) => {
        return (
          <div
            key={num}
            className="circleContainer"
            style={{ position: "relative", display: "inline-block" }}
          >
            <Circle
              number={num + 1}
              colour={getColour(
                progress[chapterNumber]?.[num + 1]?.status || "unmemorised",
              )}
              handleClick={() => handleStatusHoverableClick(num + 1)}
            />
            {statusHoverableShowing === num + 1 && (
              <ChangeStatusHoverable
                currentState={
                  progress[chapterNumber]?.[num + 1]?.status || "unmemorised"
                }
                changeState={(newState) =>
                  updateVerse(chapterNumber, num + 1, newState)
                }
                closeHoverable={() => closeHoverable(num + 1)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
