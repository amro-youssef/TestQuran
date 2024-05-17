import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { getChapterNames, getNumberVerses } from '../../backend.js';
import useMediaQuery from '@mui/material/useMediaQuery';

const TestDialog = ({ open, closeDialog, loadState, openTestPage }) => {
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0); // State to control the active tab

  const [startChapters, setStartChapters] = useState([]);
  const [startVerses, setStartVerses] = useState([]);
  const [startChapterNumber, setStartChapterNumber] = useState();
  const [startChapterName, setStartChapterName] = useState(null);
  const [startChapter, setStartChapter] = useState(null);
  const [startVerseNumber, setStartVerseNumber] = useState(null);
  
  const [endChapters, setEndChapters] = useState([]);
  const [endVerses, setEndVerses] = useState([]);
  const [endChapterNumber, setEndChapterNumber] = useState();
  const [endChapterName, setEndChapterName] = useState(null);
  const [endChapter, setEndChapter] = useState(null);
  const [endVerseNumber, setEndVerseNumber] = useState(null);

  const [numQuestions, setNumQuestions] = useState(5);

  const isMobile = useMediaQuery('(max-width:600px)');

  // Other state variables and effect hooks...

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (open) {
      setShowTestDialog(true);
      setStartChapter("1 Al-Fatihah");
      setStartChapterName("Al Fatihah");
      setStartChapterNumber(1)
      setStartVerses([])
      setStartVerseNumber(1);

      setEndChapter("114 An-Nas");
      setEndChapterName("An-Nas");
      setEndChapterNumber(114)
      setEndVerses([])
      setEndVerseNumber(6);
    }
  }, [open])

  
  useEffect(() => {
    getChapterNames().then(chapters => setStartChapters(chapters));
  }, []);

  useEffect(() => {
      loadState(startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber, numQuestions)
  }, [startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber, numQuestions])

    // updates the end chapter value
  useEffect(() => {
    getChapterNames().then(chapters => {
        if (startChapterNumber) {
            setEndChapters(chapters.slice(startChapterNumber - 1))
          } else {
            setEndChapters(chapters)
          }
        if (startChapterNumber > endChapterNumber) {
            setEndChapter(startChapter);
            setEndChapterName(startChapterName);
            setEndChapterNumber(startChapterNumber);
            setEndVerseNumber(null)
          }
    });
  }, [startChapterName]);

  // updates the start verse number
  useEffect(() => {
  const fetchVersesCount = async () => {
      if (startChapterNumber === 0 || startChapterName === null) {
          return;
        }
      try {
          const versesCount = await getNumberVerses(startChapterNumber);
          if (startVerseNumber > versesCount) {
              setStartVerseNumber(null);
            }
            if (!versesCount) {
              setStartVerses(null);
          } else {
              const startVersesList = Array.from(Array(versesCount).keys()).map(item => (item + 1).toString())
              setStartVerses(startVersesList);
          }
      } catch (error) {
          console.log(error);
      }
  };
  fetchVersesCount();
  }, [startChapterNumber]);

  // updates the end verse
  useEffect(() => {
      const fetchVersesCount = async () => {
        if (endChapterNumber === 0 || endChapterName === null) {
          return;
        }
        try {
              const versesCount = await getNumberVerses(endChapterNumber);
              if (endVerseNumber > versesCount) {
                setEndVerseNumber(null)
              }
              if ((startChapterNumber == endChapterNumber && startVerseNumber > endVerseNumber)) {
                  setEndVerseNumber(startVerseNumber)
                }
              let verseArray = Array.from(Array(versesCount).keys()).map(item => (item + 1).toString());
              if (startChapterNumber == endChapterNumber && startVerseNumber) {
                  verseArray = verseArray.slice(parseInt(startVerseNumber) - 1)
              }
              if (!versesCount) {
                  setEndVerses(null);
              } else {
                  setEndVerses(verseArray);
              }
          } catch (error) {
              console.log(error);
          }
      };
      fetchVersesCount();
  }, [endChapterNumber, startChapterNumber, startVerseNumber]);

  // Function to close the test dialog
  const closeTestDialog = () => {
    setShowTestDialog(false);
    closeDialog();
  };

  return (
    <Dialog open={showTestDialog} onClose={closeTestDialog}>
      <DialogTitle>Create Test</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="test-tabs">
            <Tab label="Next Verse" />
            <Tab label="Guess Chapter" />
          </Tabs>
        </Box>
        {/* Memorization Test Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Existing content for Memorization Test */}
          <div>memorization test</div>
        <div style={{"display": "flex", "flexDirection": "row", "colorScheme": "dark"}}>
        <FormControl sx={{ m: 1, width: 200 }}>
          <FormLabel id="formlabel">Start Chapter</FormLabel>
          <Select
            value={startChapter}
            onChange={(event) => {
              try {
                  setStartChapter(event.target.value);
                  setStartChapterName(event.target.value.split(' ').slice(1).join(' '));
                  setStartChapterNumber(parseInt(event.target.value.split(' ')[0]))
                  setStartVerses([])
              } catch {}
              }}
            >
            {startChapters.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 200 }}>
          <FormLabel id="formlabel">Start Verse</FormLabel>
          <Select
            value={startVerseNumber}
            onChange={(event) => {
              try {
                  setStartVerseNumber(event.target.value);
              } catch {}
            }}
          >
            {startVerses.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </div>

        <div style={{"display": "flex", "flexDirection": "row"}}>
        <FormControl sx={{ m: 1, width: 200 }}>
          <FormLabel id="formlabel">End Chapter</FormLabel>
          <Select
            onChange={(event) => {
              // change to an if
              try {
                  setEndChapter(event.target.value);
                  setEndChapterName(event.target.value.split(' ').slice(1).join(' '));
                  setEndChapterNumber(parseInt(event.target.value.split(' ')[0]))
                  setEndVerses([])
              } catch {
              }
          }}
            value={endChapter}
          >
            {endChapters.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{ m: 1, width: 200 }}>
          <FormLabel id="formlabel">End Verse</FormLabel>
          <Select
            onChange={(event) => {
              try {
                  setEndVerseNumber(event.target.value);
              } catch {}
          }}
            value={endVerseNumber}
          >
            {endVerses.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
        </div>

        <div id="number-of-questions-div">
        <FormControl><FormLabel id="formlabel">Number of questions</FormLabel>
          {/* <TextField type="number" inputProps={{ type: 'number'}} min="1" defaultValue="1" onChange={(e) => {setNumQuestions(e.target.value)}}required/> */}
          <Select
            onChange={(e) => {setNumQuestions(e.target.value)}}
            value={numQuestions}
            defaultValue={5}
          >
            {Array.from(Array(99).keys()).map((name) => (
              <MenuItem
                key={name+1}
                value={name+1}
              >
                {name+1}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
        </div>
        </TabPanel>
        {/* Chapter Test Tab */}
        <TabPanel value={tabValue} index={1}>
          <div>guess chapter</div>
          {/* Content for Chapter Test */}
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeTestDialog}>Cancel</Button>
        <Button
          disabled={
            // Disable conditions based on the active tab
            tabValue === 0
              ? !startChapter || !startVerseNumber || !endChapter || !endVerseNumber || !numQuestions
              : // Other disable conditions for Chapter Test
                false
          }
          onClick={openTestPage}
        >
          Start Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// TabPanel component to render the content of each tab
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default TestDialog;