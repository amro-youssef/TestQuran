/* eslint-disable eqeqeq */
import './App.css';
import Home from './pages/Home/Home.jsx';
import Test from './pages/Test/Test.jsx';
import TestResults from './pages/TestResults/TestResults.jsx';
import About from './pages/About/About.jsx';
import TestDialog from './dialogs/TestDialog/TestDialog.jsx' 
import MenuBar from './components/MenuBar/MenuBar.jsx' 
import Footer from './components/Footer/Footer.jsx'
import {React, useState, useEffect} from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import themes from './themes.js'
import Journal from './pages/Journal/Journal.jsx';

const App = () => { 
  const [testDialog, setTestDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [startChapterNumber, setStartChapterNumber] = useState();
  const [startVerseNumber, setStartVerseNumber] = useState();
  const [endChapterNumber, setEndChapterNumber] = useState();
  const [endVerseNumber, setEndVerseNumber] = useState();
  const [numQuestions, setNumQuestions] = useState();
  const [reciterNumber, setReciterNumber] = useState(1);
  const [testMode, setTestMode] = useState();

  const loadState = (startChapter, startVerse, endChapter, endVerse, numQuestions, testMode) => {
    setStartChapterNumber(parseInt(startChapter));
    setStartVerseNumber(parseInt(startVerse));
    setEndChapterNumber(parseInt(endChapter));
    setEndVerseNumber(parseInt(endVerse));
    setNumQuestions(parseInt(numQuestions));
    setTestMode(testMode);
    console.log(testMode)
  }

//   function generateFontFaces(count) {
//     const style = document.createElement('style');
//     let css = '';

//     for (let i = 1; i <= count; i++) {
//         css += `
//             @font-face {
//                 font-family: "v2_pg${i}";
//                 src: local('v2'),
//                      url(/fonts/v2/woff2/p${i}.woff2) format('woff2'),
//                      url(/fonts/v2/woff/p${i}.woff) format('woff'),
//                      url(/fonts/v2/ttf/p${i}.ttf) format('truetype');
//             }
//         `;

//         css += `
//             @font-face {
//                 font-family: "v1_pg${i}";
//                 src: local('v1'),
//                      url(/fonts/v1/woff2/p${i}.woff2) format('woff2'),
//                      url(/fonts/v1/woff/p${i}.woff) format('woff'),
//                      url(/fonts/v1/ttf/p${i}.ttf) format('truetype');
//             }
//         `;
//     }

//     style.textContent = css;
//     document.head.appendChild(style);
// }

// generateFontFaces(604);

const openTestPage = () => {
  navigate('/test');
}

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") !== "false"); 
  const [themeColor, setThemeColor] = useState(localStorage.getItem("themeColor") || "blue");

  const currentAccent = themes[themeColor] || themes.blue;
  const accent = darkMode ? currentAccent.dark : currentAccent.light;

  // Apply CSS variables for accent colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-link', accent.linkColor);
    root.style.setProperty('--accent-selection-shadow', accent.selectionShadow);
    root.style.setProperty('--accent-selection-outline', accent.selectionOutline);
    root.style.setProperty('--accent-selection-bg', accent.selectionBg);
  }, [accent]);

    const darkTheme = createTheme({ 
        palette: { 
            mode: darkMode ? 'dark' : 'light',
            primary: { main: accent.primary },
            secondary: { main: accent.secondary },
            background: {
              default: darkMode ? '#242526' : '#f0ede6',
              ...(darkMode ? {} : { paper: '#f7f5f0' }),
            },
        }, 
    }); 
    const toggleDarkMode = (checked) => {
      setDarkMode(checked);
      localStorage.setItem("darkMode", checked);
    };
    const changeThemeColor = (color) => {
      setThemeColor(color);
      localStorage.setItem("themeColor", color);
    };

  return (
    <>

    <title>Test Quran</title>
    <ThemeProvider theme={darkTheme}> 
      <CssBaseline /> 

      <MenuBar 
        testPressed={() => setTestDialog(true)}
        isHomePage={location.pathname === '/'}
        goHome={() => {
          setTestDialog(false);
          navigate('/');
        }}
        style={{height: '10vh'}}
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        setReciterNumber={setReciterNumber}
        showResultsPage={() => {navigate('/testresults')}}
        themeColor={themeColor}
        changeThemeColor={changeThemeColor}
        >
      </MenuBar>

      <Routes>
        <Route path="/" element={
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
        } />
        <Route path="/test" element={
          <Test 
            // goHome={() => {
            //   setTestDialog(false);
            //   navigate('/');
            // }}
            // state={{
            //   startChapterNumber: startChapterNumber,
            //   startVerseNumber: startVerseNumber,
            //   endChapterNumber: endChapterNumber,
            //   endVerseNumber: endVerseNumber,
            //   numQuestions: numQuestions,
            //   testMode: testMode,
            // }}
            // setShowResultsPage={() => navigate('/testresults')}
          />
        } />
        <Route path="/testresults" element={
          <TestResults />
        } />
        <Route path="/about" element={
          <About />
        } />
        <Route path="/journal" element={
          <Journal />
        } />
      </Routes>

    <Footer />
    </ThemeProvider> 
    </>


  );
}
export default App;
