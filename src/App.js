import './App.css';
import {getAudioUrl, getChapters, getChapterNames, getNumberVerses, getVerseText} from './backend.js';
import {React, useState, useEffect} from 'react';
import Title from './components/Title/Title';
import Header from './components/Header/Header';
import VersePicker from './components/VersePicker/VersePicker';
import SubmitButton from './components/SubmitButton/SubmitButton';
import VerseBox from './components/VerseBox/VerseBox';
import SwipeableTemporaryDrawer from './components/Sidebar/Sidebar';
import AudioBar from './components/AudioBar/AudioBar'

const App = () => { 
  const [startChapterNumber, setStartChapterNumber] = useState(null); 
  const [endChapterNumber, setEndChapterNumber] = useState(null); 
  const [startVerseNumber, setStartVerseNumber] = useState(null); 
  const [endVerseNumber, setEndVerseNumber] = useState(null); 

  const [verseText, setVerseText] = useState(null);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [showVerseNumbers, setShowVerseNumbers] = useState(false);
  const [reciterNumber, setReciterNumber] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const [secondVerseText, setSecondVerseText] = useState(null);
  const [secondChapterNumber, setSecondChapterNumber] = useState(null);
  const [secondVerseNumber, setSecondVerseNumber] = useState(null);

  const [thirdVerseText, setThirdVerseText] = useState(null);
  const [thirdChapterNumber, setThirdChapterNumber] = useState(null);
  const [thirdVerseNumber, setThirdVerseNumber] = useState(null);

  const [showRestOfChapter, setShowRestOfChapter] = useState(false);
  const [restOfVerses, setRestOfVerses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [verseBoxes, setVerseBoxes] = useState([]);

  const loadState = (startChapter, startVerse, endChapter, endVerse) => {
      setStartChapterNumber(startChapter);
      setStartVerseNumber(startVerse);
      setEndChapterNumber(endChapter);
      setEndVerseNumber(endVerse);
  }

  const onClick = async () => {
    setLoading(true);
    const versesList = await getVersesList(parseInt(startChapterNumber), parseInt(startVerseNumber),
    parseInt(endChapterNumber), parseInt(endVerseNumber));
    console.log("verses list", versesList)
    if (versesList.some(element => element === null)) {
      return;
    }
    const randomVerse = await getRandomVerse(versesList)
    resetStates();
    setCurrentVerse(randomVerse);
    console.log("random vrese", randomVerse)
    const randomText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    if (randomText !== -1) {
      setVerseText(randomText);
      // await generateVerseBoxes(randomVerse?.chapterNumber, randomVerse?.verseNumber, randomVerse?.chapterNumber, randomVerse?.verseNumber)
    }
    setLoading(false);
  };


  const resetStates = () => {
    setCurrentVerse(null);
    setSecondChapterNumber(null);
    setSecondVerseNumber(null);
    setThirdChapterNumber(null);
    setThirdVerseNumber(null);
    setShowVerseNumbers(false);
    setReadMore(false);
    setAudioUrl(null);
    setShowRestOfChapter(false);
    setRestOfVerses([])
  }

  const getRandomVerse = async (verseList) => {
    const list = await verseList;
    return list[Math.floor(Math.random()*list.length)];
  };

  const getVersesList = async (startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber) => {
    const verseList = [];
    if (startChapterNumber == endChapterNumber) {
      for (let j = startVerseNumber; j <= endVerseNumber; j++) {
        verseList.push({
          chapterNumber: startChapterNumber,
          verseNumber: j
        })
      }
      return verseList;

    }
    for (let i = startChapterNumber; i <= endChapterNumber; i++) {
      const numVersesInChapter = await getNumberVerses(i);
      if (i == startChapterNumber) {
        for (let j = startVerseNumber; j <= numVersesInChapter; j++) {
          verseList.push({
            chapterNumber: i,
            verseNumber: j
          })
        }
      } else if (i == endChapterNumber) {
        for (let j = 1; j <= endVerseNumber; j++) {
          verseList.push({
            chapterNumber: i,
            verseNumber: j
          })
        }
      } else {
        for (let j = 1; j <= numVersesInChapter; j++) {
          verseList.push({
            chapterNumber: i,
            verseNumber: j
          })
        }
      }

    }
    return verseList
  }

  const expandPressed = async () => {
    // will need to deal will overlap of chapters
    // setCurrentVerse({chapterNumber: 0, verseNumber: 0})
    console.log("currentVerse", readMore, currentVerse)
    if (!readMore) {
      console.log("read more")
      const secondVerse = await getVerseText(currentVerse.chapterNumber, currentVerse.verseNumber + 1);
      const thirdVerse = await getVerseText(currentVerse.chapterNumber, currentVerse.verseNumber + 2);
      if (secondVerse !== -1) {
        setSecondVerseText(secondVerse);
        if (thirdVerse !== -1) {
          setThirdVerseText(thirdVerse);
        }
      }
      setSecondChapterNumber(currentVerse.chapterNumber);
      setSecondVerseNumber(currentVerse.verseNumber + 1)
      setThirdChapterNumber(currentVerse.chapterNumber);
      setThirdVerseNumber(currentVerse.verseNumber + 2)

      // let endVerseNumber = currentVerse.verseNumber;
      // endVerseNumber = secondVerse !== -1 ? endVerseNumber + 1 : endVerseNumber;
      // endVerseNumber = thirdVerse !== -1 ? endVerseNumber + 1 : endVerseNumber;

      // // why are we passing expand pressed? This is the function we're in right now...
      // console.log("end verse number", endVerseNumber)
      // await generateVerseBoxes(currentVerse.chapterNumber, currentVerse.verseNumber, currentVerse.chapterNumber, endVerseNumber)
    } else {
      setSecondVerseText(null);
      setThirdVerseText(null);
      // await generateVerseBoxes(currentVerse.chapterNumber, currentVerse.verseNumber, currentVerse.chapterNumber, currentVerse.verseNumber, expandPressed)
    }

    setReadMore(!readMore);
  }

  const getRestOfVerses = async () => {
    const numVerses = await getNumberVerses(currentVerse.chapterNumber);
    let restOfVerses = []
    for (let verse = currentVerse.verseNumber; verse <= numVerses; verse++) {
      const text = await getVerseText(currentVerse.chapterNumber, verse);
      restOfVerses.push({chapter: currentVerse.chapterNumber, verse: verse, text: text});
    }
    if (restOfVerses.length > 3) {
      restOfVerses = restOfVerses.slice(3);
    } else {
      return [];
    }
    setRestOfVerses(restOfVerses);

    // return restOfVerses;
  }

  const onViewVerseNumberChange = () => {
    setShowVerseNumbers(!showVerseNumbers);
  }

  const handleReadRestOfChapter = () => {
    setShowRestOfChapter(!showRestOfChapter);
    getRestOfVerses();
  };

  const playAudio = async (chapterNumber, verseNumber) => {
    const url = await getAudioUrl(chapterNumber, verseNumber, reciterNumber); //=get from backend
    // strangely the api sometimes returns a direct link to the mp3, and sometimes it only gives the end part
    if (url.substring(0, 2) === "//") {
      setAudioUrl(url);
    } else {
      setAudioUrl("https://verses.quran.com/" + url);
    }
  }
  
  // const generateVerseBoxes = async (startChapter, startVerse, endChapter, endVerse, readMorePressed) => {
  //   console.log(startChapter, startVerse, endChapter, endVerse)
  //   const verseBoxesArray = [];
  //   const list = [];
  //   for (let chapter = startChapter; chapter <= endChapter; chapter++) {
  //     const start = (chapter == startChapter) ? startVerse : 1;
  //     const end = (chapter == endChapter) ? endVerse : await getNumberVerses(chapter);
  
  //     for (let verse = start; verse <= end; verse++) {
  //       const verseText = await getVerseText(chapter, verse);
  //       if (!verseText || verseText == "") {
  //         continue;
  //       }
  //       verseBoxesArray.push(
  //         <VerseBox
  //           key={`verse-${chapter}-${verse}`}
  //           verseText={verseText}
  //           chapterNumber={chapter}
  //           verseNumber={verse}
  //           viewVerseNumber={showVerseNumbers}
  //           onViewVerseNumberChange={onViewVerseNumberChange}
  //           playAudio={playAudio}
  //           // readMorePressed={(readMorePressed && (verse == startVerse)) ? readMorePressed : null}
  //           readMorePressed={(verse == start) ? doExpand : null}
  //         />
  //       );
  //     }
  //   }
  //   console.log(verseBoxesArray)
  //   console.log("verse hook list", versesListHook)
  //   setVerseBoxes(verseBoxesArray);
  // }

  // const doExpand = async () => {
  //   setReadMore(!readMore);
  // }

  // useEffect(() => { 
  //   console.log("---------use effect called")
  //   async function callExpand() {
  //     await expandPressed();
  //   }
  //   if (verseBoxes.length > 0) {
  //     console.log("verse boxes > 0")
  //     callExpand();
  //   }
  // }, [readMore])

  return (
    <div className="App light">
      <header style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
        <div style={{marginRight: '65px', flexShrink: 2}}></div>
        <Header style={{justifyContent: 'center', flexShrink: 2}}/>
        <div style={{display: 'flex', justifyContent: 'right', alignSelf: 'flex-end'}}>
          <SwipeableTemporaryDrawer setReciterNumber={(num) => {setReciterNumber(num)}}/>
        </div>
      </header>
      <Title />
      <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <VersePicker loadState={loadState}/>
        <SubmitButton onClick={onClick} loading={loading}/>
      </div>
      {/* {showRestOfChapter ? (
        getRestOfVerses().then(verses => verses.map(verseInfo => {
          return(
          <VerseBox
            verseText={verseInfo.text}
            readMorePressed={expandPressed}
            chapterNumber={verseInfo.chapter}
            verseNumber={verseInfo.verse}
            viewVerseNumber={showVerseNumbers}
            onViewVerseNumberChange={onViewVerseNumberChange}
            playAudio={playAudio}
          />)
        }))
        
      ): <></>} */}

      {verseText ? (
        <>
          <div style={{ marginTop: '2em' }}></div>
          <VerseBox
            verseText={verseText}
            readMorePressed={expandPressed}
            chapterNumber={currentVerse?.chapterNumber}
            verseNumber={currentVerse?.verseNumber}
            viewVerseNumber={showVerseNumbers}
            onViewVerseNumberChange={onViewVerseNumberChange}
            playAudio={playAudio}
          />

          {readMore && secondVerseText ?  (
            <>
              <VerseBox
                verseText={secondVerseText}
                chapterNumber={secondChapterNumber}
                verseNumber={secondVerseNumber}
                viewVerseNumber={showVerseNumbers}
                onViewVerseNumberChange={onViewVerseNumberChange}
                playAudio={playAudio}
              />
            </>
          ) : <></>}
          {readMore && thirdVerseText ?  (
            <>
              <VerseBox
                verseText={thirdVerseText}
                chapterNumber={thirdChapterNumber}
                verseNumber={thirdVerseNumber}
                viewVerseNumber={showVerseNumbers}
                onViewVerseNumberChange={onViewVerseNumberChange}
                playAudio={playAudio}
              />
              {!showRestOfChapter && 
                <p>
                  <button className='text-link' onClick={handleReadRestOfChapter}>
                    Read rest of chapter
                  </button>
                </p>
              }
            </>
          ) : <></>}
        </>
      ) : <></>} 

      {showRestOfChapter && readMore &&
        restOfVerses.map((verseInfo) => (
          <VerseBox
            key={`${verseInfo.chapter}-${verseInfo.verse}`}
            verseText={verseInfo.text}
            chapterNumber={verseInfo.chapter}
            verseNumber={verseInfo.verse}
            viewVerseNumber={showVerseNumbers}
            onViewVerseNumberChange={onViewVerseNumberChange}
            playAudio={playAudio}
          />
      ))}
          

      {/* {versesListHook.map(v => {
        getVerseText(v?.chapterNumber, v?.verseNumber).then(response => {return(
          <VerseBox
            verseText={response}
            readMorePressed={expandPressed}
            chapterNumber={v?.chapterNumber}
            verseNumber={v?.verseNumber}
            viewVerseNumber={showVerseNumbers}
            onViewVerseNumberChange={onViewVerseNumberChange}
            playAudio={playAudio}
          />);})
      })} */}
      {verseBoxes}
    {audioUrl ? (<AudioBar audioFile={audioUrl}/>) : null}

    </div>
    
  );
}

export default App;
