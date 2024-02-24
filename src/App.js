/* eslint-disable eqeqeq */
import './App.css';
import Home from './pages/Home/Home.js';
import Test from './pages/Test/Test.js';
import TestDialog from './components/TestDialog/TestDialog.js' 
import {React, useState} from 'react';
import 'animate.css';

const App = () => { 
  const [testDialog, setTestDialog] = useState(false);
  const [testPage, setTestPage] = useState(false);

  const [startChapterNumber, setStartChapterNumber] = useState();
  const [startVerseNumber, setStartVerseNumber] = useState();
  const [endChapterNumber, setEndChapterNumber] = useState();
  const [endVerseNumber, setEndVerseNumber] = useState();
  const [numQuestions, setNumQuestions] = useState();

  const loadState = (startChapter, startVerse, endChapter, endVerse, numQuestions) => {
    setStartChapterNumber(parseInt(startChapter));
    setStartVerseNumber(parseInt(startVerse));
    setEndChapterNumber(parseInt(endChapter));
    setEndVerseNumber(parseInt(endVerse));
    setNumQuestions(parseInt(numQuestions));
  }

  const openTestPage = () => {
    setTestPage(true);
  }

  return (
    !testPage ?
      <>
      <Home className="App light" testPressed={() => setTestDialog(true)}/> 
      {testDialog ? 
        <TestDialog
          open={true} 
          closeDialog={() => setTestDialog(false)} 
          loadState={(a,b,c,d,e) => loadState(a,b,c,d,e)} 
          openTestPage={openTestPage}/>
          : <></>}
      </>
    : <Test goHome={() => {
        setTestPage(false);
        setTestDialog(false);
        }}
        state={{
          startChapterNumber: startChapterNumber,
          startVerseNumber: startVerseNumber,
          endChapterNumber: endChapterNumber,
          endVerseNumber: endVerseNumber,
          numQuestions: numQuestions
        }}
    
    ></Test>
  );
}
/* : <Test goHome={() => setTestPage(false)}/> */
export default App;
