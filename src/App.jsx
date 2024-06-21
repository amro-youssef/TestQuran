/* eslint-disable eqeqeq */
import './App.css';
import Home from './pages/Home/Home.jsx';
import Test from './pages/Test/Test.jsx';
import TestResults from './pages/TestResults/TestResults.jsx';
import TestDialog from './dialogs/TestDialog/TestDialog.jsx' 
import MenuBar from './components/MenuBar/MenuBar.jsx' 
import Footer from './components/Footer/Footer.jsx'
import {React, useState} from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const App = () => { 
  const [testDialog, setTestDialog] = useState(false);
  const [testPage, setTestPage] = useState(false);

  const [startChapterNumber, setStartChapterNumber] = useState();
  const [startVerseNumber, setStartVerseNumber] = useState();
  const [endChapterNumber, setEndChapterNumber] = useState();
  const [endVerseNumber, setEndVerseNumber] = useState();
  const [numQuestions, setNumQuestions] = useState();
  const [reciterNumber, setReciterNumber] = useState(1);
  const [testMode, setTestMode] = useState();
  const [showResultsPage, setShowResultsPage] = useState(false);

  const loadState = (startChapter, startVerse, endChapter, endVerse, numQuestions, testMode) => {
    setStartChapterNumber(parseInt(startChapter));
    setStartVerseNumber(parseInt(startVerse));
    setEndChapterNumber(parseInt(endChapter));
    setEndVerseNumber(parseInt(endVerse));
    setNumQuestions(parseInt(numQuestions));
    setTestMode(testMode);
    console.log(testMode)
  }

  function generateFontFaces(count) {
    const style = document.createElement('style');
    let css = '';

    for (let i = 1; i <= count; i++) {
        css += `
            @font-face {
                font-family: "v2_pg${i}";
                src: local('v2'),
                     url(/fonts/v2/woff2/p${i}.woff2) format('woff2'),
                     url(/fonts/v2/woff/p${i}.woff) format('woff'),
                     url(/fonts/v2/ttf/p${i}.ttf) format('truetype');
            }
        `;

        css += `
            @font-face {
                font-family: "v1_pg${i}";
                src: local('v1'),
                     url(/fonts/v1/woff2/p${i}.woff2) format('woff2'),
                     url(/fonts/v1/woff/p${i}.woff) format('woff'),
                     url(/fonts/v1/ttf/p${i}.ttf) format('truetype');
            }
        `;
    }

    style.textContent = css;
    document.head.appendChild(style);
}

generateFontFaces(604);

const openTestPage = () => {
  setTestPage(true);
}

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") !== "false"); 
    const darkTheme = createTheme({ 
        palette: { 
            mode: darkMode ? 'dark' : 'light',
            background: {
              default: darkMode ? '#242526' : '#f5f5f5',
            },
        }, 
    }); 
    const toggleDarkMode = (checked) => {
      setDarkMode(checked);
      localStorage.setItem("darkMode", checked);
    };

  return (
    <>

    <title>Test Quran</title>
    <ThemeProvider theme={darkTheme}> 
      <CssBaseline /> 

      <MenuBar 
        testPressed={() => setTestDialog(true)}
        isHomePage={!testPage && !showResultsPage}
        goHome={() => {
          setTestPage(false);
          setTestDialog(false);
          setShowResultsPage(false);
        }}
        style={{height: '10vh'}}
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        setReciterNumber={setReciterNumber}
        showResultsPage={() => {setShowResultsPage(true)}}
        >
      </MenuBar>

      {showResultsPage ? (
        <>
          <TestResults 
              // Pass any necessary props for TestResults
          />
        </>
      ) : (
        <>
          {testPage ? (
            <Test 
              goHome={() => {
                setTestPage(false);
                setTestDialog(false);
                setShowResultsPage(false);
              }}
              state={{
                startChapterNumber: startChapterNumber,
                startVerseNumber: startVerseNumber,
                endChapterNumber: endChapterNumber,
                endVerseNumber: endVerseNumber,
                numQuestions: numQuestions,
                testMode: testMode,
              }}
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
              setShowResultsPage={setShowResultsPage}
            />
          ) : (
            <>
            <Home style={{marginTop: '50px'}} className="App" testPressed={() => setTestDialog(true)} toggleDarkMode={toggleDarkMode} darkMode={darkMode} reciterNumber={reciterNumber}/> 
            {testDialog ? 
              <TestDialog
                open={true} 
                closeDialog={() => setTestDialog(false)} 
                loadState={(a,b,c,d,e,f) => loadState(a,b,c,d,e,f)} 
                openTestPage={openTestPage}/>
                : <></>}
            </>
            // <TestResults 
            //   // Pass any necessary props for TestResults
            // />
          )}
        </>
      )}

    <Footer />
    </ThemeProvider> 
    </>


  );
}
export default App;
