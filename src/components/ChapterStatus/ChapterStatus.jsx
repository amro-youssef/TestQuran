import { useState } from "react";
import "./ChapterStatus.css";
import VerseStatusHoverable from "../VerseStatusHoverable/VerseStatusHoverable";

export default function ChapterStatus({ numVerses, name, chapterNumber }) {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="chapterContainer">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsClicked((prev) => !prev)}
        className="chapterName"
      >
        {name}
      </div>
      {(isHovering || isClicked) && <VerseStatusHoverable chapterNumber={chapterNumber} numVerses={numVerses} />}
    </div>
  );
}
