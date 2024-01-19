import {React, useState, useEffect} from 'react';
import {getChapters, getChapterNames, getNumberVerses} from './../../backend.js'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import './VersePicker.css'
import { Select } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuItem from '@mui/material/MenuItem';



const VersePicker = ({ loadState }) => {
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

    const isMobile = useMediaQuery('(max-width:600px)');
    
    useEffect(() => {
        getChapterNames().then(chapters => setStartChapters(chapters));
    }, []);

    useEffect(() => {
        loadState(startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber)
    }, [startChapterNumber, startVerseNumber, endChapterNumber, endVerseNumber])

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

    String.prototype.toIndiaDigits= function(){
        var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        return this.replace(/[0-9]/g, function(w){
         return id[+w]
        });
       }

    return (
        <div className='VersePicker'>
        {/* {!isMobile ? ( */}
        {true ? (
        <>
            <div className='startDiv'>
                <Autocomplete
                    // value={chapterNameSelected}
                    onChange={(event, chapterName) => {
                        try {
                            setStartChapter(chapterName);
                            setStartChapterName(chapterName.split(' ').slice(1).join(' '));
                            setStartChapterNumber(parseInt(chapterName.split(' ')[0]))
                            setStartVerses([])
                        } catch {}
                    }}
                    className='Autocomplete chapter'
                    disablePortal
                    disableClearable
                    id="start-chapter"
                    value={startChapter}
                    options={startChapters}
                    // sx={{ width: '13em', marginRight: '10px' }}
                    renderInput={(params) => <TextField {...params} label="Start Chapter" />}
                    style={{ display: 'flex', justifyContent: 'center', color: '#fff' }}
                />
                <Autocomplete
                    onChange={(event, verseNumber) => {
                        try {
                            setStartVerseNumber(verseNumber);
                        } catch {}
                    }}
                    className='Autocomplete verse'
                    disablePortal
                    disableClearable
                    id="start-verse"
                    options={startVerses}
                    value = {startVerseNumber}
                    // options={[...Array(numVersesInChapter).keys()].map(item => item + 1)}
                    // sx={{ width: '9.5em', marginLeft: '10px' }}
                    renderInput={(params) => <TextField {...params} label="Start Verse" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    //defaultValue={chapters.chapterNumberSelected} need to get verse count of each chapter, then auto set this to the first
                />
            </div>

            <div className='endDiv'>
                <Autocomplete
                    // TODO need to add functionality that means end chapter is bigger than start  
                    // value={chapterNameSelected}
                    onChange={(event, chapterName) => {
                        // change to an if
                        try {
                            setEndChapter(chapterName);
                            setEndChapterName(chapterName.split(' ').slice(1).join(' '));
                            setEndChapterNumber(parseInt(chapterName.split(' ')[0]))
                            setEndVerses([])
                        } catch {
                        }
                        //setNumVersesInChapter(getNumberVerses(parseInt(chapterName.split(' ')[0])))
                    }}
                    className='Autocomplete chapter'
                    value={endChapter}
                    disablePortal
                    disableClearable
                    id="end-chapter"
                    options={endChapters}
                    // sx={{ width: '13em', marginRight: '10px' }}
                    renderInput={(params) => <TextField {...params} label="End Chapter" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                />
                <Autocomplete
                    onChange={(event, verseNumber) => {
                        try {
                            setEndVerseNumber(verseNumber);
                        } catch {}
                    }}
                    className='Autocomplete verse'
                    disablePortal
                    disableClearable
                    id="end-verse"
                    options={endVerses}
                    value = {endVerseNumber}
                    // options={[...Array(numVersesInChapter).keys()].map(item => item + 1)}
                    // sx={{ width: '9.5em', marginLeft: '10px' }}
                    renderInput={(params) => <TextField {...params} label="End Verse" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    //defaultValue={chapters.chapterNumberSelected} need to get verse count of each chapter, then auto set this to the first
                /> 
            </div>
        </>) : (
            <>
            <div className='startDiv'>
              <div className="select-container">
                <InputLabel htmlFor='start-chapter'>Start Chapter</InputLabel>
                <Select
                    value={startChapter}
                    onChange={(event) => {
                    try {
                        const chapterName = event.target.value;
                        setStartChapter(chapterName);
                        setStartChapterName(chapterName.split(' ').slice(1).join(' '));
                        setStartChapterNumber(parseInt(chapterName.split(' ')[0]));
                        setStartVerses([]);
                    } catch {}
                    }}
                >
                    {startChapters.map((chapter) => (
                    <MenuItem key={chapter} value={chapter}>
                        {chapter}
                    </MenuItem>
                    ))}
                </Select>
              </div>
    
              <div className="select-container">
                <InputLabel htmlFor='start-verse'>Start Verse</InputLabel>
                <Select
                    value={startVerseNumber}
                    onChange={(event) => {
                    try {
                        setStartVerseNumber(event.target.value);
                    } catch {}
                    }}
                >
                    {startVerses.map((verse) => (
                    <MenuItem key={verse} value={verse}>
                        {verse}
                    </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
    
            <div className='endDiv'>
                <div className="select-container">
              <InputLabel htmlFor='end-chapter'>End Chapter</InputLabel>
              <Select
                value={endChapter}
                onChange={(event) => {
                  try {
                    const chapterName = event.target.value;
                    setEndChapter(chapterName);
                    setEndChapterName(chapterName.split(' ').slice(1).join(' '));
                    setEndChapterNumber(parseInt(chapterName.split(' ')[0]));
                    setEndVerses([]);
                  } catch {}
                }}
              >
                {endChapters.map((chapter) => (
                  <MenuItem key={chapter} value={chapter}>
                    {chapter}
                  </MenuItem>
                ))}
              </Select>
              </div>
    
              <div className="select-container">
              <InputLabel htmlFor='end-verse'>End Verse</InputLabel>
              <Select
                value={endVerseNumber}
                onChange={(event) => {
                  try {
                    setEndVerseNumber(event.target.value);
                  } catch {}
                }}
              >
                {endVerses.map((verse) => (
                  <MenuItem key={verse} value={verse}>
                    {verse}
                  </MenuItem>
                ))}
              </Select>
              </div>
            </div>
          </>
        )}
        </div>
        
    )
}


export default VersePicker;