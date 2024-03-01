/* eslint-disable eqeqeq */
import './Home.css';
import {getAudioUrl, getNumberVerses, getVerseText, getChapterName} from './../../backend.js';
import {React, useState} from 'react';
import Title from './../../components/Title/Title';
import Header from './../../components/Header/Header';
import VersePicker from './../../components/VersePicker/VersePicker';
import SubmitButton from './../../components/SubmitButton/SubmitButton';
import Button from '@mui/material/Button';
import VerseBox from './../../components/VerseBox/VerseBox';
import SwipeableTemporaryDrawer from './../../components/Sidebar/Sidebar';
import AudioBar from './../../components/AudioBar/AudioBar';
import 'animate.css';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const Home = ( {testPressed, darkMode, toggleDarkMode} ) => { 
  const [startChapterNumber, setStartChapterNumber] = useState(null); 
  const [endChapterNumber, setEndChapterNumber] = useState(null); 
  const [startVerseNumber, setStartVerseNumber] = useState(null); 
  const [endVerseNumber, setEndVerseNumber] = useState(null); 
  const [chapterName, setChapterName] = useState(null); 

  const [verseText, setVerseText] = useState(null);
  const [firstVerse, setFirstVerse] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [showVerseNumbers, setShowVerseNumbers] = useState(false);
  const [reciterNumber, setReciterNumber] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);

  const [secondVerseText, setSecondVerseText] = useState(null);
  const [thirdVerseText, setThirdVerseText] = useState(null);

  const [showRestOfChapter, setShowRestOfChapter] = useState(false);
  const [restOfVerses, setRestOfVerses] = useState([]);

  const [bounce1, setBounce1] = useState(false);
  const [bounce2, setBounce2] = useState(false);
  const [bounce3, setBounce3] = useState(false);
  const [bounce4, setBounce4] = useState(false);

  const [loading, setLoading] = useState(false);
  const [versePlaying, setVersePlaying] = useState();

  const loadState = (startChapter, startVerse, endChapter, endVerse) => {
      setStartChapterNumber(parseInt(startChapter));
      setStartVerseNumber(parseInt(startVerse));
      setEndChapterNumber(parseInt(endChapter));
      setEndVerseNumber(parseInt(endVerse));
  }

  const onClick = async () => {
    if (checkEmptyFields()) return;
    setLoading(true);
    const versesList = await getVersesList(parseInt(startChapterNumber), parseInt(startVerseNumber),
    parseInt(endChapterNumber), parseInt(endVerseNumber));
    if (versesList.some(element => element === null)) {
      return;
    }
    const randomVerse = await getRandomVerse(versesList);
    resetStates();
    setFirstVerse(randomVerse);
    const randomText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    if (randomText !== -1) {
      setVerseText(randomText);
    }
    setLoading(false);
    setChapterName(await getChapterName(randomVerse?.chapterNumber));

    if (localStorage.getItem('autoPlayAudio') === 'true') {
      playAudio(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    }
  };

  /**
   * @return whether there are empty fields
   */
  const checkEmptyFields = () => {
    if (!startChapterNumber) {
      setBounce1(true);
      setTimeout(() => {
        setBounce1(false);
      }, 1000);
      return true;
    } if (!startVerseNumber) {
      setBounce2(true);
      setTimeout(() => {
        setBounce2(false);
      }, 1000);
      return true;
    } if (!endChapterNumber) {
      setBounce3(true);
      setTimeout(() => {
        setBounce3(false);
      }, 1000);
      return true;
    } if (!endVerseNumber) {
      setBounce4(true);
      setTimeout(() => {
        setBounce4(false);
      }, 1000);
      return true;
    }
  }

  const resetStates = () => {
    setFirstVerse(null);
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
    if (!readMore) {
      const secondVerse = await getVerseText(firstVerse.chapterNumber, firstVerse.verseNumber + 1);
      const thirdVerse = await getVerseText(firstVerse.chapterNumber, firstVerse.verseNumber + 2);
      if (secondVerse !== -1) {
        setSecondVerseText(secondVerse);
        if (thirdVerse !== -1) {
          setThirdVerseText(thirdVerse);
        }
      }
      // setSecondChapterNumber(parseInt(firstVerse.chapterNumber));
      // setSecondVerseNumber(parseInt(firstVerse.verseNumber + 1));
      // setThirdChapterNumber(parseInt(firstVerse.chapterNumber));
      // setThirdVerseNumber(parseInt(firstVerse.verseNumber + 2));

    } else {
      setSecondVerseText(null);
      setThirdVerseText(null);
      // await generateVerseBoxes(firstVerse.chapterNumber, firstVerse.verseNumber, firstVerse.chapterNumber, firstVerse.verseNumber, expandPressed)
    }

    setReadMore(!readMore);
  }

  const getRestOfVerses = async () => {
    const numVerses = await getNumberVerses(firstVerse.chapterNumber);
    let restOfVerses = []

    // perhaps do this in chunks in order for the page to appear responsive
    for (let verse = firstVerse.verseNumber; verse <= numVerses; verse++) {
      const text = await getVerseText(firstVerse.chapterNumber, verse);
      restOfVerses.push({chapter: firstVerse.chapterNumber, verse: verse, text: text});
      if (verse % 10 === 0) {
        setRestOfVerses(restOfVerses.slice(3));
      }
    }
    if (restOfVerses.length > 3) {
      restOfVerses = restOfVerses.slice(3);
    } else {
      return [];
    }
    setRestOfVerses(restOfVerses);
  }

  const onViewVerseNumberChange = () => {
    setShowVerseNumbers(!showVerseNumbers);
  }

  const handleReadRestOfChapter = () => {
    setShowRestOfChapter(!showRestOfChapter);
    getRestOfVerses();
  };

  const playAudio = async (chapterNumber, verseNumber) => {
    const url = await getAudioUrl(chapterNumber, verseNumber, reciterNumber);
    // this is used to fix an error where pressing the play button next to a verse
    // for a verse already loaded in the audio bar not playing. It's not ideal as
    // it causes the audio bar to disappear then reappear
    if (audioUrl && audioUrl.includes(url)) {
      setAudioUrl(null);
      setTimeout(() => {
        try {
          if (url.substring(0, 2) === "//") {
            setAudioUrl(url);
          } else {
            setAudioUrl("https://verses.quran.com/" + url);
          }
          setVersePlaying( {
            chapterNumber: chapterNumber,
            verseNumber: verseNumber
          })
        } catch {
    
        }
      });
    }
    else {
      try {
        if (url.substring(0, 2) === "//") {
          setAudioUrl(url);
        } else {
          setAudioUrl("https://verses.quran.com/" + url);
        }
        setVersePlaying( {
          chapterNumber: chapterNumber,
          verseNumber: verseNumber
        })
      } catch {
  
      }
    }
  }

  const incrementVerseAudio = async () => {
    if (!versePlaying) {
      return;
    }
    // makes it so that only the verses on the screen can be played
    if (versePlaying.verseNumber + 1 > getLastVerseOnScreen()) {
      return;
    }
    const versesInChapter = await getNumberVerses(versePlaying.chapterNumber);
    if (versesInChapter > versePlaying.verseNumber) {
      playAudio(versePlaying.chapterNumber, versePlaying.verseNumber + 1);
    }
  }

  const decrementVerseAudio = async () => {
    if (!versePlaying) {
      return;
    }
    // makes it so that only the verses on the screen can be played
    if (versePlaying.verseNumber - 1 < getFirstVerseOnScreen()) {
      return;
    }
    if (versePlaying.verseNumber > 1) {
      playAudio(versePlaying.chapterNumber, versePlaying.verseNumber - 1);
    }
  }
  /**
   * Gets the verse index of first verse shown
   */
  const getFirstVerseOnScreen = () => {
    return firstVerse?.verseNumber;
  }

  /**
   * Gets the verse index of last verse shown
   */
  const getLastVerseOnScreen = () => {
    if (restOfVerses.length > 0) {
      return restOfVerses[restOfVerses.length - 1].verse;
    }
    else if (thirdVerseText) {
      return firstVerse?.verseNumber + 2;
    } else if (secondVerseText) {
      return firstVerse?.verseNumber + 1;
    }
    return firstVerse?.verseNumber;
  }


  return (
      <div className="App">
        <header style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
          <div style={{marginRight: '140px', flexShrink: 2}}></div>
          <Header style={{justifyContent: 'center', flexShrink: 2}}/>
          <div style={{display: 'flex', justifyContent: 'right', alignSelf: 'flex-end'}}>
            <DarkModeSwitch
            checked={darkMode}
            onChange={toggleDarkMode}
            style={{display: 'flex', marginRight: "20px", marginTop: "6px"}}
            />
            <Button variant="outlined" onClick={testPressed}>Test</Button>
            <SwipeableTemporaryDrawer setReciterNumber={(num) => {setReciterNumber(num)}}/>
          </div>
        </header>
        <Title />
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          <VersePicker 
            loadState={loadState} 
            bounce1={bounce1}
            bounce2={bounce2}
            bounce3={bounce3}
            bounce4={bounce4}
          />
          <SubmitButton onClick={onClick} loading={loading}/>
        </div>
        {verseText ? (
          <>
            <div style={{ marginTop: '2em' }}></div>
            <VerseBox
              verseText={verseText}
              readMorePressed={expandPressed}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              playAudio={playAudio}
              versePlaying={audioUrl ? versePlaying : null}
            />

            {readMore && secondVerseText ?  (
              <>
                <VerseBox
                  verseText={secondVerseText}
                  chapterNumber={firstVerse?.chapterNumber}
                  verseNumber={firstVerse?.verseNumber + 1}
                  chapterName={chapterName}
                  viewVerseNumber={showVerseNumbers}
                  onViewVerseNumberChange={onViewVerseNumberChange}
                  playAudio={playAudio}
                  versePlaying={audioUrl ? versePlaying : null}
                  hideVerse={true}
                />
              </>
            ) : <></>}
            {readMore && thirdVerseText ?  (
              <>
                <VerseBox
                  verseText={thirdVerseText}
                  chapterNumber={firstVerse?.chapterNumber}
                  verseNumber={firstVerse?.verseNumber + 2}
                  chapterName={chapterName}
                  viewVerseNumber={showVerseNumbers}
                  onViewVerseNumberChange={onViewVerseNumberChange}
                  playAudio={playAudio}
                  versePlaying={audioUrl ? versePlaying : null}
                  hideVerse={true}
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
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              playAudio={playAudio}
              versePlaying={audioUrl ? versePlaying : null}
              hideVerse={true}
            />
        ))}
      {audioUrl ? (<AudioBar audioFile={audioUrl} incrementVerseAudio={incrementVerseAudio} decrementVerseAudio={decrementVerseAudio}/>) : null}
        
      <div style={{ marginTop: '5em' }}></div>
      </div>
    
  );
}

export default Home;
