import './App.css';
import {getChapters, getChapterNames, getNumberVerses, getVerseText} from './backend.js';
import {React, useState, useEffect} from 'react';
import Title from './components/Title/Title';
import Header from './components/Header/Header';
import VersePicker from './components/VersePicker/VersePicker';
import Verse from './components/Verse/Verse';
import SubmitButton from './components/SubmitButton/SubmitButton';

const App = () => { 
  const [startChapterNumber, setStartChapterNumber] = useState(null); 
  const [endChapterNumber, setEndChapterNumber] = useState(null); 
  const [startVerseNumber, setStartVerseNumber] = useState(null); 
  const [endVerseNumber, setEndVerseNumber] = useState(null); 
  const [verseText, setVerseText] = useState(null);

  const loadState = (startChapter, startVerse, endChapter, endVerse) => {
      setStartChapterNumber(startChapter);
      setStartVerseNumber(startVerse);
      setEndChapterNumber(endChapter);
      setEndVerseNumber(endVerse);
  }

  const onClick = async () => {
    const versesList = await getVersesList(parseInt(startChapterNumber), parseInt(startVerseNumber),
                          parseInt(endChapterNumber), parseInt(endVerseNumber))
    const randomVerse = await getRandomVerse(versesList)
    const randomText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    setVerseText(randomText);
  };
  

  const getRandomVerse = async (verseList) => {
    const list = await verseList;
    return list[Math.floor(Math.random()*list.length)];
  };

  const getVersesList = async (startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber) => {
    const verseList = [];
    if (startChapterNumber == endChapterNumber) {
      const numVersesInChapter = await getNumberVerses(startChapterNumber);
      for (let j = 1; j <= numVersesInChapter; j++) {
        verseList.push({
          chapterNumber: startChapterNumber,
          verseNumber: j
        })
      }

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
      }

      for (let j = 1; j <= numVersesInChapter; j++) {
        verseList.push({
          chapterNumber: i,
          verseNumber: j
        })
      }

    }
    return verseList
  }

  return (
    <div className="App light">
      <Header />
      <Title />
      <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <VersePicker loadState={loadState}/>
        <SubmitButton onClick={onClick} />
      </div>
      <Verse verseText={verseText}/>
    </div>
  );
}

export default App;
