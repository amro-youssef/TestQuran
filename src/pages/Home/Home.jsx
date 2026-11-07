/* eslint-disable eqeqeq */
import './Home.css';
import {getAudioUrl, getNumberVerses, getVerseText, getChapterName, getVerseV1Glyph, getVerseV2Glyph, getRandomVerseByPage as pickRandomVerseByPage} from '../../backend.js';
import {React, useState} from 'react';
import VerseBox from '../../components/VerseBox/VerseBox.jsx';
import AudioBar from '../../components/AudioBar/AudioBar.jsx';
import { getVerseTextOfFont } from '../../utils.js';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton.jsx';
import VerseSelector from '../../components/VerseSelector/VerseSelector.jsx';
import { selectionVerses, versesIn, withIds, WHOLE_QURAN } from '../../components/VerseSelector/selection.js';
import { useSettingsStore, selectMode } from '../../store/useSettingsStore.js';
import { useSetsStore } from '../../store/useSetsStore.js';


const Home = ( {testPressed, darkMode, toggleDarkMode, reciterNumber} ) => { 
  // starts on whatever was tested last, or the whole Quran the first time
  const [selection, setSelection] = useState(() => withIds(useSetsStore.getState().recent[0]?.items ?? WHOLE_QURAN));
  const addRecent = useSetsStore(s => s.addRecent);
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
  const [audioLoading, setAudioLoading] = useState(null);
  const mode = useSettingsStore(selectMode);
  const setMode = useSettingsStore((state) => state.setMode);
  const hideVerse = useSettingsStore((state) => state.hideVerse);
  const autoPlayAudio = useSettingsStore((state) => state.autoPlayAudio);

  // items is passed in (rather than read from state) so a saved set can be loaded and tested in one tap
  const onSubmitClick = async (items) => {
    const versesList = selectionVerses(items);
    if (versesList.length === 0) return;
    setLoading(true);
    addRecent(items.map(({ id, ...item }) => item));

    const randomizeMode = localStorage.getItem('randomizeMode') || 'byPage';
    let randomVerse;
    if (randomizeMode === 'byPage') {
      randomVerse = await getRandomVerseByPage(versesList);
    } else {
      randomVerse = await getRandomVerse(versesList);
    }
    let numberOfVerses = await getNumberVerses(randomVerse.chapterNumber);
    // avoids the last verse in the chapter being chosen, unless this is the only verse specified
    const hasNonLastVerse = versesList.some(v => v.verseNumber !== versesIn(v.chapterNumber));
    while (hasNonLastVerse && randomVerse.verseNumber === numberOfVerses) {
      if (randomizeMode === 'byPage') {
        randomVerse = await getRandomVerseByPage(versesList);
      } else {
        randomVerse = await getRandomVerse(versesList);
      }
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

    if (autoPlayAudio) {
      playAudio(randomVerse?.chapterNumber, randomVerse?.verseNumber);
    }
  };

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
    // return list[Math.floor(Math.random()*list.length)];
    // although Math.random() should be enough for this type of function, I felt the results being produced
    // would often be close to the previous answer and not be properly evenly distributed
    return list[Math.floor(randFloatWithCrypto()*list.length)];
  };

  const getRandomVerseByPage = (verseList) => pickRandomVerseByPage(verseList, randFloatWithCrypto);

/**
* Return a random float between 0 (inclusive) and 1 (exclusive) using the Crypto module.
*/
function randFloatWithCrypto() {
	var [ randomInt ] = crypto.getRandomValues( new Uint32Array( 1 ) );
	var maxInt = 4294967295;
	return ( randomInt / ( maxInt + 1 ) );

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
    setAudioLoading({ chapterNumber, verseNumber });
    const url = await getAudioUrl(chapterNumber, verseNumber, reciterNumber);
    setAudioLoading(null);

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
        <div className='selector-container'>
          <VerseSelector
            items={selection}
            onItemsChange={setSelection}
            mode={mode}
            onModeChange={setMode}
            onRandomize={onSubmitClick}
            loading={loading}
          />
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
              hideVerse = {hideVerse}
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
                  hideVerse = {hideVerse}
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
                  hideVerse = {hideVerse}
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
              hideVerse = {hideVerse}
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
                  hideVerse = {hideVerse}
                /> */}
                {lastVerseIsOnScreen && 
                    <p id='end-of-chapter'>
                      {/* <button id='next-verse' className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`} onClick={getNextVerse}> */}
                        End of Chapter
                      {/* </button> */}
                    </p>}
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
        
      {(audioUrl || audioLoading) ? (<AudioBar audioFile={audioUrl} audioLoading={!!audioLoading} incrementVerseAudio={incrementVerseAudio} decrementVerseAudio={decrementVerseAudio}/>) : null}
        
      <ScrollToTopButton/>
      <div style={{ marginTop: '5em' }}></div>
      </div>
    
  );
}

export default Home;
