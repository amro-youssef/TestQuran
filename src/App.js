/* eslint-disable eqeqeq */
import './App.css';
import Home from './pages/Home/Home.js';
import Test from './pages/Test/Test.js';
import TestDialog from './components/TestDialog/TestDialog.js' 
import {React, useState} from 'react';
import { Switch } from '@mui/material'; 


import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import 'animate.css';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

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

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true"); 
    const darkTheme = createTheme({ 
        palette: { 
            mode: darkMode ? 'dark' : 'light',
            background: {
              default: darkMode ? '#242526' : '#f0f0f0', // Adjust to your preferred light/off-white background color
            },
        }, 
    }); 
    const toggleDarkMode = (checked) => {
      setDarkMode(checked);
      localStorage.setItem("darkMode", checked);
    };

  return (
    <ThemeProvider theme={darkTheme}> 
      <CssBaseline /> 

      {!testPage ?
      <>
      <Home className="App light" testPressed={() => setTestDialog(true)} toggleDarkMode={toggleDarkMode} darkMode={darkMode}/> 
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
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
    ></Test>}
    </ThemeProvider> 




    // !testPage ?
    //   <>
    //   <Home className="App light" testPressed={() => setTestDialog(true)}/> 
    //   {testDialog ? 
    //     <TestDialog
    //       open={true} 
    //       closeDialog={() => setTestDialog(false)} 
    //       loadState={(a,b,c,d,e) => loadState(a,b,c,d,e)} 
    //       openTestPage={openTestPage}/>
    //       : <></>}
    //   </>
    // : <Test goHome={() => {
    //     setTestPage(false);
    //     setTestDialog(false);
    //     }}
    //     state={{
    //       startChapterNumber: startChapterNumber,
    //       startVerseNumber: startVerseNumber,
    //       endChapterNumber: endChapterNumber,
    //       endVerseNumber: endVerseNumber,
    //       numQuestions: numQuestions
    //     }}
    
    // ></Test>
  );
}
/* : <Test goHome={() => setTestPage(false)}/> */
export default App;
