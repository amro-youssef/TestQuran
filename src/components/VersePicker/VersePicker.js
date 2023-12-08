import {React, useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './VersePicker.css'


const getChapterNames = () => {
    return fetch('https://api.quran.com/api/v4/chapters/', {
    method: 'GET',
        headers: { 
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        return response?.chapters?.map(chapter => (`${chapter?.id} ${chapter?.name_simple}`))
    })
    .catch((error) => {
        console.log(error);
        return []
    });
}

const getNumberVerses = async (chapterNumber) => {
    try {
        const response = await fetch(`https://api.quran.com/api/v4/chapters/${chapterNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        console.log("getNumberVerses", data?.chapter?.verses_count);
        return data?.chapter?.verses_count;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

const VersePicker = () => {
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
    
    useEffect(() => {
        getChapterNames().then(chapters => setStartChapters(chapters));
    }, []);

    // updates the end chapter value
    useEffect(() => {
        getChapterNames().then(chapters => {
            if (startChapterNumber) {
                setEndChapters(chapters.slice(startChapterNumber - 1))
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
                setStartVerseNumber(null)
            }
            console.log("verse count:", versesCount)
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

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }} className='VersePicker'>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
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
                    disablePortal
                    disableClearable
                    id="start-chapter"
                    value={startChapter}
                    options={startChapters}
                    sx={{ width: 200, marginRight: '10px' }}
                    renderInput={(params) => <TextField {...params} label="Start Chapter" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                />
                <Autocomplete
                    onChange={(event, verseNumber) => {
                        try {
                            setStartVerseNumber(verseNumber);
                        } catch {}
                    }}
                    disablePortal
                    disableClearable
                    id="start-verse"
                    options={startVerses}
                    value = {startVerseNumber}
                    // options={[...Array(numVersesInChapter).keys()].map(item => item + 1)}
                    sx={{ width: 150, marginLeft: '10px' }}
                    renderInput={(params) => <TextField {...params} label="Start Verse" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    //defaultValue={chapters.chapterNumberSelected} need to get verse count of each chapter, then auto set this to the first
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
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
                    value={endChapter}
                    disablePortal
                    disableClearable
                    id="end-chapter"
                    options={endChapters}
                    sx={{ width: 200, marginRight: '10px' }}
                    renderInput={(params) => <TextField {...params} label="End Chapter" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                />
                <Autocomplete
                    onChange={(event, verseNumber) => {
                        try {
                            setEndVerseNumber(verseNumber);
                        } catch {}
                    }}
                    disablePortal
                    disableClearable
                    id="end-verse"
                    options={endVerses}
                    value = {endVerseNumber}
                    // options={[...Array(numVersesInChapter).keys()].map(item => item + 1)}
                    sx={{ width: 150, marginLeft: '10px' }}
                    renderInput={(params) => <TextField {...params} label="End Verse" />}
                    style={{ display: 'flex', justifyContent: 'center' }}
                    //defaultValue={chapters.chapterNumberSelected} need to get verse count of each chapter, then auto set this to the first
                />
            </div>


        </div>
        
    )
}


export default VersePicker;