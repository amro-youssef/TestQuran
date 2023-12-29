import './App.css';
import {getAndPlayAudio, getChapters, getChapterNames, getNumberVerses, getVerseText} from './backend.js';
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

  const loadState = (startChapter, startVerse, endChapter, endVerse) => {
      setStartChapterNumber(startChapter);
      setStartVerseNumber(startVerse);
      setEndChapterNumber(endChapter);
      setEndVerseNumber(endVerse);
  }

  const onClick = async () => {
    resetStates();
    const versesList = await getVersesList(parseInt(startChapterNumber), parseInt(startVerseNumber),
                          parseInt(endChapterNumber), parseInt(endVerseNumber));
    console.log("verses list", versesList)
    if (versesList.some(element => element === null)) {
      return;
    }
    const randomVerse = await getRandomVerse(versesList)
    setCurrentVerse(randomVerse);
    const randomText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    if (randomText !== -1) {
      setVerseText(randomText);
    }
  };


  const resetStates = () => {
    setCurrentVerse(null);
    setSecondChapterNumber(null);
    setSecondVerseNumber(null);
    setThirdChapterNumber(null);
    setThirdVerseNumber(null);
    setShowVerseNumbers(false);
    setReadMore(false);
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

  const readMorePressed = async () => {
    // will need to deal will overlap of chapters
    if (!readMore) {
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
    } else {
      setSecondVerseText(null);
      setThirdVerseText(null)
    }

    setReadMore(!readMore);
  }

  const onViewVerseNumberChange = () => {
    setShowVerseNumbers(!showVerseNumbers);
  }

  const playAudio = async (chapterNumber, verseNumber, reciterNumber) => {
    const url = await getAndPlayAudio(chapterNumber, verseNumber, reciterNumber); //=get from backend
    // strangely the api sometimes returns a direct link to the mp3, and sometimes it only gives the end part
    if (url.substring(0, 2) === "//") {
      setAudioUrl(url);
    } else {
      setAudioUrl("https://verses.quran.com/" + url);
    }
  }

  return (
    <div className="App light">
      <header style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
        <div style={{marginRight: '65px', flexShrink: 2}}></div>
        <Header style={{justifyContent: 'center', flexShrink: 2}}/>
        <div style={{display: 'flex', justifyContent: 'right', alignSelf: 'flex-end'}}>
          <SwipeableTemporaryDrawer setReciterNumber={(num) => setReciterNumber(num)}/>
        </div>
      </header>
      <Title />
      <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <VersePicker loadState={loadState}/>
        <SubmitButton onClick={onClick} />
      </div>
      {verseText ? (
        <>
          <div style={{ marginTop: '2em' }}></div>
          <VerseBox
            verseText={verseText}
            readMorePressed={readMorePressed}
            chapterNumber={currentVerse?.chapterNumber}
            verseNumber={currentVerse?.verseNumber}
            viewVerseNumber={showVerseNumbers}
            onViewVerseNumberChange={onViewVerseNumberChange}
            playAudio={playAudio}
            reciterNumber={reciterNumber}
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
                reciterNumber={reciterNumber}
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
                reciterNumber={reciterNumber}
              />
            </>
          ) : <></>}
        </>
      ) : <></>}
    <AudioBar audioFile={audioUrl}/>
    </div>
    
  );
}

export default App;
