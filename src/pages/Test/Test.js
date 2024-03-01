import {React, useState, useEffect} from 'react';
import {getAudioUrl, getNumberVerses, getVerseText, getChapterName} from './../../backend.js';
import { Button, CircularProgress } from '@mui/material';
import ProgressBar from "@ramonak/react-progress-bar";
import VerseBox from './../../components/VerseBox/VerseBox';
import AudioBar from './../../components/AudioBar/AudioBar';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import './Test.css'

const Test = ( {goHome, state} ) => {

    // state.startChapterNumber,
    // state.startVerseNumber,
    // state.endChapterNumber,
    // state.endVerseNumber,
    // state.numQuestions
    const [firstVerse, setFirstVerse] = useState();
    const [firstVerseText, setFirstVerseText] = useState();
    const [secondVerseText, setSecondVerseText] = useState();
    const [thirdVerseText, setThirdVerseText] = useState();
    const [chapterName, setChapterName] = useState();
    const [showOtherVerses, setShowOtherVerses] = useState();
    const [showVerseNumbers, setShowVerseNumbers] = useState(false);

    const [currentQuestionNumber, setCurrentQuetionNumber] = useState(1);
    const [numberCorrectAnswers ,setNumberCorrectAnswers] = useState(0);
    const [correctSelected, setCorrectSelected] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const loadVerses = async () => {
      setIsLoading(true);
      const versesList = await getVersesList(parseInt(state.startChapterNumber), parseInt(state.startVerseNumber),
        parseInt(state.endChapterNumber), parseInt(state.endVerseNumber));
      if (versesList.some(element => element === null)) {
        return;
      }
      const randomVerse = await getRandomVerse(versesList);
      setFirstVerse(randomVerse);
      const firstVerseText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber);
      const numberVersesInChapter = await getNumberVerses(randomVerse.chapterNumber);
      setChapterName(await getChapterName(randomVerse?.chapterNumber));

      if (firstVerseText !== -1) {
        setFirstVerseText(firstVerseText);
      }
      if (randomVerse?.verseNumber + 1 <= numberVersesInChapter) {
        const secondVerseText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber + 1);
        setSecondVerseText(secondVerseText);
        if (randomVerse?.verseNumber + 2 <= numberVersesInChapter) {
          const thirdVerseText = await getVerseText(randomVerse?.chapterNumber, randomVerse?.verseNumber + 2);
          setThirdVerseText(thirdVerseText);
        }
      }
      setIsLoading(false);
      
      // setChapterName(await getChapterName(randomVerse?.chapterNumber));
  
      // if (localStorage.getItem('autoPlayAudio') === 'true') {
      //   playAudio(randomVerse?.chapterNumber, randomVerse?.verseNumber);
      // }
    };

    const nextQuestionPressed = () => {
      if (correctSelected === null) {
        return;
      }
      if (currentQuestionNumber >= state.numQuestions) {
        // TODO handle
        alert(`number correct answers: ${correctSelected ? numberCorrectAnswers + 1 : numberCorrectAnswers}`)
        goHome();
        // return;
      }
      if (correctSelected) {
        setNumberCorrectAnswers(numberCorrectAnswers + 1);
      }
      resetStates();
      loadVerses();
      setCurrentQuetionNumber(currentQuestionNumber + 1);
    }

    const resetStates = () => {
      setFirstVerse(null);
      setFirstVerseText(null);
      setSecondVerseText(null);
      setThirdVerseText(null);
      setChapterName(null);
      setShowOtherVerses(null);
      setShowVerseNumbers(false);
      setCorrectSelected(null);
    }

    useEffect(() => {
      loadVerses();
    }, [])

    const getRandomVerse = async (verseList) => {
      const list = await verseList;
      return list[Math.floor(Math.random()*list.length)];
    };

    const onViewVerseNumberChange = () => {
      setShowVerseNumbers(!showVerseNumbers);
    };

    const expandPressed = async () => {
      console.log("expand pressed. showotherVerses: ", showOtherVerses, secondVerseText)
      setShowOtherVerses(!showOtherVerses);
    }

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

    return (
        <div className="App light">
        <h1>Memorization Test</h1>
        <h3>Question {currentQuestionNumber} out of {state.numQuestions}</h3>

        <div style={{ width: '80%', margin: 'auto' }}>
        <ProgressBar 
            completed={100 * (currentQuestionNumber / state.numQuestions)}
            bgColor="#007bff"
            height="5px"
            labelColor="#e80909"
            customLabel=" "
            width="100%"
            style={{"margin":"auto"}}
        />
        </div>
        <Button height="30px" size="medium" onClick={goHome}>Home</Button>
        <div style={{ marginTop: '2em' }}></div>
        {isLoading ? 
          <div className="loading-spinner">
            <CircularProgress />
          </div> :
          <>
            <VerseBox
              verseText={firstVerseText}
              readMorePressed={expandPressed}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
            />

        {showOtherVerses && secondVerseText ?  (
          <>
            <VerseBox
              verseText={secondVerseText}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber + 1}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
              hideVerse={true}
            />
          </>
        ) : <></>}

        {showOtherVerses && thirdVerseText ?  (
          <>
            <VerseBox
              verseText={thirdVerseText}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber + 1}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
              hideVerse={true}
            />
          </>
        ) : <></>}

    {showOtherVerses ?  
      <div className='bottom-div'>
        <p className='question-text'>Were you correct:  </p>
        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          style={{
            borderRadius: '50%', // Make the button circular
            minWidth: 0, // Ensure the button doesn't have extra padding
            width: 48, // Set the width and height to make it circular
            height: 48,
            // backgroundColor: correctSelected === true ? '#3de33d' : '#E0E0E0'
            backgroundColor: correctSelected === false ? '#E0E0E0' : '#3de33d'
          }}
          onClick={() => setCorrectSelected(true)}
          >
          <DoneIcon />
        </Button>

        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          style={{
            borderRadius: '50%', // Make the button circular
            minWidth: 0, // Ensure the button doesn't have extra padding
            width: 48, // Set the width and height to make it circular
            height: 48,
            // backgroundColor: correctSelected === false ? '#fc4242' : '#E0E0E0' 
            backgroundColor: correctSelected === true ? '#E0E0E0' : '#fc4242' 
          }}
          onClick={() => setCorrectSelected(false)}
          >
          <CloseIcon />
        </Button>

        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          onClick={nextQuestionPressed}
          disabled={
          (correctSelected !== true && correctSelected !== false) ? true : false}
        >
          Next Question
        </Button>

        <div style={{padding: '100px 0px 0px 0px'}}></div>
      </div>
    : <></>
  }
          </>
        }
        {/* <VerseBox
              verseText={firstVerseText}
              readMorePressed={expandPressed}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
            />

        {showOtherVerses && secondVerseText ?  (
          <>
            <VerseBox
              verseText={secondVerseText}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber + 1}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
              hideVerse={true}
            />
          </>
        ) : <></>}

        {showOtherVerses && thirdVerseText ?  (
          <>
            <VerseBox
              verseText={thirdVerseText}
              chapterNumber={firstVerse?.chapterNumber}
              verseNumber={firstVerse?.verseNumber + 1}
              chapterName={chapterName}
              viewVerseNumber={showVerseNumbers}
              onViewVerseNumberChange={onViewVerseNumberChange}
              // playAudio={playAudio}
              playAudio={() => {}} //TODO
              // versePlaying={audioUrl ? versePlaying : null}
              versePlaying={false}
              hideVerse={true}
            />
          </>
        ) : <></>}

    {showOtherVerses ?  
      <div className='bottom-div'>
        <p className='question-text'>Were you correct:  </p>
        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          style={{
            borderRadius: '50%', // Make the button circular
            minWidth: 0, // Ensure the button doesn't have extra padding
            width: 48, // Set the width and height to make it circular
            height: 48,
            // backgroundColor: correctSelected === true ? '#3de33d' : '#E0E0E0'
            backgroundColor: correctSelected === false ? '#E0E0E0' : '#3de33d'
          }}
          onClick={() => setCorrectSelected(true)}
          >
          <DoneIcon />
        </Button>

        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          style={{
            borderRadius: '50%', // Make the button circular
            minWidth: 0, // Ensure the button doesn't have extra padding
            width: 48, // Set the width and height to make it circular
            height: 48,
            // backgroundColor: correctSelected === false ? '#fc4242' : '#E0E0E0' 
            backgroundColor: correctSelected === true ? '#E0E0E0' : '#fc4242' 
          }}
          onClick={() => setCorrectSelected(false)}
          >
          <CloseIcon />
        </Button>

        <div style={{padding: '0px 20px 0px 0px'}}></div>

        <Button
          variant="contained"
          onClick={nextQuestionPressed}
          disabled={
          (correctSelected !== true && correctSelected !== false) ? true : false}
        >
          Next Question
        </Button>

        <div style={{padding: '100px 0px 0px 0px'}}></div>
      </div>
    : <></>
  } */}
    </div>
    )
}

export default Test;