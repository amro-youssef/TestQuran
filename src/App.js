/* eslint-disable eqeqeq */
import './App.css';
import Home from './pages/Home/Home.js';
import Test from './pages/Test/Test.js';
import TestDialog from './components/TestDialog/TestDialog.js' 
import MenuBar from './components/MenuBar/MenuBar.js' 
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
  const [reciterNumber, setReciterNumber] = useState(1);

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

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") !== "false"); 
    const darkTheme = createTheme({ 
        palette: { 
            mode: darkMode ? 'dark' : 'light',
            background: {
              default: darkMode ? '#242526' : '#f5f5f5', // Adjust to your preferred light/off-white background color
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

      <MenuBar 
        testPressed={() => setTestDialog(true)}
        isHomePage={!testPage}
        goHome={() => {
          setTestPage(false);
          setTestDialog(false);
        }}
        style={{height: '10vh'}}
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        setReciterNumber={setReciterNumber}>
      </MenuBar>
      {!testPage ?
      <>
      <Home className="App" testPressed={() => setTestDialog(true)} toggleDarkMode={toggleDarkMode} darkMode={darkMode} reciterNumber={reciterNumber}/> 
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

  );
}
export default App;
