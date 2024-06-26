/* eslint-disable eqeqeq */
import {React, useState, useEffect} from 'react';
import {getChapterNames, getNumberVerses} from '../../backend.js'
import {TextField, MenuItem, Autocomplete, Select, useMediaQuery, FormControl, FormLabel, NativeSelect, InputLabel} from '@mui/material';
import './VersePickerMobile.css'

const VersePickerMobile = ({ loadState, bounce1, bounce2, bounce3, bounce4 }) => {
    const [startChapters, setStartChapters] = useState([]);
    const [startVerses, setStartVerses] = useState([]);
    const [startChapterNumber, setStartChapterNumber] = useState(1);
    const [startChapterName, setStartChapterName] = useState("Al-Fatihah");
    const [startChapter, setStartChapter] = useState("1 Al-Fatihah"); // TODO add default values
    const [startVerseNumber, setStartVerseNumber] = useState(1);
    
    const [endChapters, setEndChapters] = useState([]);
    const [endVerses, setEndVerses] = useState([]);
    const [endChapterNumber, setEndChapterNumber] = useState(114);
    const [endChapterName, setEndChapterName] = useState("An-Nas");
    const [endChapter, setEndChapter] = useState("114 An-Nas");
    const [endVerseNumber, setEndVerseNumber] = useState(6);

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
                setStartVerseNumber(1);
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
                    setEndVerseNumber(1)
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
        <div className='VersePickerMobile'>
            <div className='startDivMobile'>
                <FormControl sx={{ width: '52vw' , m: 0.5}}>
                <InputLabel id="formlabel">Start Chapter</InputLabel>
                <Select
                    value={startChapter}
                    inputProps={{
                        name: 'start-chapter',
                        id: 'start-chapter-native',
                      }}
                    className="startChapterSelect"
                    id="start-chapter"
                    label="Start Chapter"
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

                <FormControl sx={{ width: '35vw', m: 0.5 }}>
                <InputLabel id="formlabel">Start Verse</InputLabel>
                <Select
                    value={startVerseNumber}
                    // className={`Autocomplete verse  ${bounce2 ? 'animate__animated animate__bounce' : ''}`}
                    id="start-verse"
                    label="Start Verse"
                    className="startVerseSelect"
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

            <div className='endDivMobile'>
                <FormControl sx={{ width: "52vw", m: 0.5 }}>
                <InputLabel id="formlabel">End Chapter</InputLabel>
                <Select
                    id="end-chapter"
                    className="endChapterSelect"
                    label="End Chapter"
                    onChange={(event) => {
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

                <FormControl sx={{ width: '35vw', m: 0.5 }}>
                <InputLabel id="formlabel">End Verse</InputLabel>
                <Select
                    id="end-verse"
                    className="endVerseSelect"
                    label="End Verse"
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
        </div>
        
    )
}

export default VersePickerMobile;