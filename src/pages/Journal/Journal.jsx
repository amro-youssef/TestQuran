import { getChapters } from "../../backend"
import "./Journal.css"
import ChapterStatus from "../../components/ChapterStatus/ChapterStatus";

// Mapping of chapters to Juzs (30 Juzs total)
const CHAPTER_TO_JUZ = {
  1: 1, 2: 1, 3: 3, 4: 3, 5: 6, 6: 7, 7: 8,
  8: 9, 9: 10, 10: 11, 11: 11, 12: 12, 13: 13, 14: 13,
  15: 14, 16: 14, 17: 15, 18: 15, 19: 16, 20: 16,
  21: 17, 22: 17, 23: 18, 24: 18, 25: 18, 26: 19,
  27: 19, 28: 20, 29: 20, 30: 21, 31: 21, 32: 21,
  33: 21, 34: 22, 35: 22, 36: 22, 37: 23, 38: 23,
  39: 23, 40: 24, 41: 24, 42: 25, 43: 25, 44: 25,
  45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
  51: 26, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27,
  57: 27, 58: 28, 59: 28, 60: 28, 61: 28, 62: 28,
  63: 28, 64: 28, 65: 28, 66: 28, 67: 29, 68: 29,
  69: 29, 70: 29, 71: 29, 72: 29, 73: 29, 74: 29,
  75: 29, 76: 29, 77: 29, 78: 30, 79: 30, 80: 30,
  81: 30, 82: 30, 83: 30, 84: 30, 85: 30, 86: 30,
  87: 30, 88: 30, 89: 30, 90: 30, 91: 30, 92: 30,
  93: 30, 94: 30, 95: 30, 96: 30, 97: 30, 98: 30,
  99: 30, 100: 30, 101: 30, 102: 30, 103: 30, 104: 30,
  105: 30, 106: 30, 107: 30, 108: 30, 109: 30, 110: 30,
  111: 30, 112: 30, 113: 30, 114: 30,
};

const getChaptersGroupedByJuz = (chapters) => {
  const juzMap = {};
  
  // Group chapters by juz
  chapters.forEach(chapter => {
    const juz = CHAPTER_TO_JUZ[chapter.id] || 30;
    if (!juzMap[juz]) {
      juzMap[juz] = [];
    }
    juzMap[juz].push(chapter);
  });
  
  return juzMap;
};

const quranChapters = await getChapters();
const chaptersByJuz = getChaptersGroupedByJuz(quranChapters);

export default function Journal() {
    return (
        <div className="trackerContainer">
            <h1>Journal</h1>
            
            {
              Object.keys(chaptersByJuz).map((juzNumber) => {
                const chapters = chaptersByJuz[juzNumber];
                return (
                  <div key={juzNumber} className="juzSection">
                    <h2>Juz {juzNumber}</h2>
                    <div className='chaptersContainer'>
                      {
                        chapters.map((item) => {
                          return <ChapterStatus key={item.id} numVerses={item.verses_count} chapterNumber={item.id} name={item.id + " " + item.name_simple} />
                        })
                      }
                    </div>
                  </div>
                );
              })
            }
        </div>
    )
}