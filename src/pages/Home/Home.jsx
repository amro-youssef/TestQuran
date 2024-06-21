/* eslint-disable eqeqeq */
import './Home.css';
import {getAudioUrl, getNumberVerses, getVerseText, getChapterName, getVerseV1Glyph, getVerseV2Glyph} from '../../backend.js';
import {React, useState} from 'react';
import VersePicker from '../../components/VersePicker/VersePicker.jsx';
import SubmitButton from '../../components/SubmitButton/SubmitButton.jsx';
import VerseBox from '../../components/VerseBox/VerseBox.jsx';
import AudioBar from '../../components/AudioBar/AudioBar.jsx';
import { getVerseTextOfFont, isMobileOrTablet } from '../../utils.js';

import useMediaQuery from '@mui/material/useMediaQuery';
import VersePickerMobile from '../../components/VersePicker/VersePickerMobile.jsx';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton.jsx';


const Home = ( {testPressed, darkMode, toggleDarkMode, reciterNumber} ) => { 
  const [startChapterNumber, setStartChapterNumber] = useState(null); 
  const [endChapterNumber, setEndChapterNumber] = useState(null); 
  const [startVerseNumber, setStartVerseNumber] = useState(null); 
  const [endVerseNumber, setEndVerseNumber] = useState(null); 
  const [chapterName, setChapterName] = useState(null); 

  const [verseText, setVerseText] = useState(null);
  const [firstVerse, setFirstVerse] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [showVerseNumbers, setShowVerseNumbers] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [lastVerseOnScreen, setLastVerseOnScreen] = useState(null);

  const [secondVerseText, setSecondVerseText] = useState(null);
  const [thirdVerseText, setThirdVerseText] = useState(null);

  const [showRestOfChapter, setShowRestOfChapter] = useState(false);
  const [restOfVerses, setRestOfVerses] = useState([]);
  const [lastVerseIsOnScreen, setLastVerseIsOnScreen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [versePlaying, setVersePlaying] = useState();

  const isMobile = useMediaQuery('(max-width:600px)');

  const loadState = (startChapter, startVerse, endChapter, endVerse) => {
      setStartChapterNumber(parseInt(startChapter));
      setStartVerseNumber(parseInt(startVerse));
      setEndChapterNumber(parseInt(endChapter));
      setEndVerseNumber(parseInt(endVerse));
  }

  const onSubmitClick = async () => {
    if (checkEmptyFields()) return;
    setLoading(true);
    const versesList = await getVersesList(parseInt(startChapterNumber), parseInt(startVerseNumber),
    parseInt(endChapterNumber), parseInt(endVerseNumber));
    if (versesList.some(element => element === null)) {
      return;
    }
    let randomVerse = await getRandomVerse(versesList);
    let numberOfVerses = await getNumberVerses(randomVerse.chapterNumber);
    // avoids the last verse in the chapter being chosen, unless this is the only verse specified
    while (startVerseNumber !== endVerseNumber && randomVerse.verseNumber === numberOfVerses) {
      randomVerse = await getRandomVerse(versesList);
      numberOfVerses = await getNumberVerses(randomVerse.chapterNumber);
    }

    if (numberOfVerses === randomVerse.verseNumber) {
      setLastVerseIsOnScreen(true);
    }

    resetStates();
    setFirstVerse(randomVerse);
    // const randomText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    const randomText = await getVerseTextOfFont(randomVerse?.chapterNumber, randomVerse?.verseNumber);
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
  }

  const resetStates = () => {
    setFirstVerse(null);
    setShowVerseNumbers(false);
    setReadMore(false);
    setAudioUrl(null);
    setShowRestOfChapter(false);
    setRestOfVerses([]);
    setLastVerseIsOnScreen(false);
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
      const secondVerse = await getVerseTextOfFont(firstVerse.chapterNumber, firstVerse.verseNumber + 1);
      if (secondVerse) {
        setSecondVerseText(secondVerse);
        if (!lastVerseOnScreen) {
          setLastVerseOnScreen(firstVerse.verseNumber + 1);
        }
        const thirdVerse = await getVerseTextOfFont(firstVerse.chapterNumber, firstVerse.verseNumber + 2);
        if (thirdVerse) {
          setThirdVerseText(thirdVerse);
          if (!lastVerseOnScreen) {
            setLastVerseOnScreen(firstVerse.verseNumber + 2);
          }
        } else {
          setThirdVerseText(null);
          // if no third verse was found, this means the last verse is on the screen
          // setLastVerseIsOnScreen(true);
        }
      } else {
        setSecondVerseText(null);
        // setLastVerseIsOnScreen(true);
      }
      
      const numberVerses = await getNumberVerses(firstVerse.chapterNumber);
      if (firstVerse.verseNumber + 2 >= numberVerses) {
        setLastVerseIsOnScreen(true);
      }

    } else {
      setSecondVerseText(null);
      setThirdVerseText(null);
    }
    setReadMore(!readMore);
  }

  const getRestOfVerses = async () => {
    const numVerses = await getNumberVerses(firstVerse.chapterNumber);
    let restOfVerses = []

    // perhaps do this in chunks in order for the page to appear responsive
    for (let verse = firstVerse.verseNumber; verse <= numVerses; verse++) {
      const text = await getVerseTextOfFont(firstVerse.chapterNumber, verse);
      restOfVerses.push({chapter: firstVerse.chapterNumber, verse: verse, text: text});
      if (verse % 10 === 0) {
        setRestOfVerses(restOfVerses.slice(3));
        // this sleeps for 0 seconds. This is used because the DOM won't render the restOfVerses so far
        // without this line
        await new Promise(r => setTimeout(r, 1));

      }
    }
    if (restOfVerses.length > 3) {
      restOfVerses = restOfVerses.slice(3);
    } else {
      return [];
    }
    setRestOfVerses(restOfVerses);
    setLastVerseIsOnScreen(true);
  }

  const getNextVerse = async () => {
    const numVerses = await getNumberVerses(firstVerse.chapterNumber);
    const lastVerseOnScreen = getLastVerseOnScreen();
    const text = await getVerseTextOfFont(firstVerse.chapterNumber, lastVerseOnScreen + 1);
    if (!text) {
      // we are at last verse
      setLastVerseIsOnScreen(true);
      return;
    }
    const list = restOfVerses ? restOfVerses : [];
    list.push({chapter: firstVerse.chapterNumber, verse: lastVerseOnScreen + 1, text: text});
    setRestOfVerses(list);
    setLastVerseOnScreen(lastVerse => lastVerse + 1);

    // if next verse or current verse is the last, set lastVerseIsOnScreen to true, which removes the
    // "read rest of chapter" and "next verse" buttons
    if (numVerses <= lastVerseOnScreen + 1) {
      setLastVerseIsOnScreen(true);
    } else {
      setLastVerseIsOnScreen(false);
    }
  }

  const onViewVerseNumberChange = () => {
    setShowVerseNumbers(!showVerseNumbers);
  }

  const handleReadRestOfChapter = () => {
    setShowRestOfChapter(true);
    getRestOfVerses();
  };

  const playAudio = async (chapterNumber, verseNumber) => {
    const url = await getAudioUrl(chapterNumber, verseNumber, reciterNumber);

    // const audio = new Audio();
    // setTimeout(async () => {
    //   const nextUrl = await getAudioUrl(chapterNumber, verseNumber + 1, reciterNumber);
    //   audio.src = nextUrl;
    //   audio.load();
    // }, 100)

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
        <h3 className='title'>Pick the range of verses you would like to be tested on:</h3>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          {/* {!isMobile ? 
          <VersePicker 
            loadState={loadState} 
          /> : 
          <VersePickerMobile
            loadState={loadState}
          />
          } */}

          {isMobile && isMobileOrTablet() ?
              <VersePickerMobile
              loadState={loadState}
            /> :
            <VersePicker 
            loadState={loadState} 
          />
        
          }
          <SubmitButton onClick={onSubmitClick} loading={loading}/>
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
              hideVerse = {localStorage.getItem('alwaysHideVerse') === "true"} // TODO make this update dynamically rather than needing refresh for it to apply
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
                  hideVerse = {localStorage.getItem('alwaysHideVerse') === "true"}
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
                  hideVerse = {localStorage.getItem('alwaysHideVerse') === "true"}
                />
                {/* {!showRestOfChapter && 
                  <p>
                    <button id='read-rest-of-chapter' className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`} onClick={handleReadRestOfChapter}>
                      Read rest of chapter
                    </button>
                  </p>
                } */}
              </>
            ) : <></>}
          </>
        ) : <></>} 

        {restOfVerses && restOfVerses.length > 0 && readMore &&
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
              hideVerse = {localStorage.getItem('alwaysHideVerse') === "true"}
            />
        ))}
        {readMore && thirdVerseText ?  (
              <>
                {/* <VerseBox
                  verseText={thirdVerseText}
                  chapterNumber={firstVerse?.chapterNumber}
                  verseNumber={firstVerse?.verseNumber + 2}
                  chapterName={chapterName}
                  viewVerseNumber={showVerseNumbers}
                  onViewVerseNumberChange={onViewVerseNumberChange}
                  playAudio={playAudio}
                  versePlaying={audioUrl ? versePlaying : null}
                  hideVerse = {localStorage.getItem('alwaysHideVerse') === "true"}
                /> */}
                {!lastVerseIsOnScreen && 
                  <div className={'bottom-button-div'}>
                    <p>
                      <button id='next-verse' className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`} onClick={getNextVerse}>
                        Next Verse
                      </button>
                    </p>
                    <p>
                      <button id='read-rest-of-chapter' className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`} onClick={handleReadRestOfChapter}>
                        Read rest of chapter
                      </button>
                    </p>
                  </div>
                }
                {/* {!showRestOfChapter && 
                  <p>
                    <button id='read-rest-of-chapter' className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`} onClick={handleReadRestOfChapter}>
                      Read rest of chapter
                    </button>
                  </p>
                } */}
              </>
            ) : <></>}
        
      {audioUrl ? (<AudioBar audioFile={audioUrl} incrementVerseAudio={incrementVerseAudio} decrementVerseAudio={decrementVerseAudio}/>) : null}
        
      <ScrollToTopButton/>
      <div style={{ marginTop: '5em' }}></div>
      </div>
    
  );
}

export default Home;
