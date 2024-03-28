import {React, useState, useEffect, useRef} from 'react';
import { Button } from '@mui/material';
import {getChapterName} from '../../backend.js'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeUp from '@mui/icons-material/VolumeUp';

import Verse from '../Verse/Verse.js';
import './VerseBox.css';

const VerseBox = (props) => {
    let { verseText, readMorePressed, chapterNumber, chapterName, verseNumber, viewVerseNumber, onViewVerseNumberChange, playAudio, hideVerse, versePlaying, showAudioButton } = props;

    const [verse, setVerse] = useState(verseText);
    const [buttonText, setButtonText] = useState(<VisibilityIcon />);
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon />);
    const [expanded, setExpanded] = useState(false);

    const showVerseNumber = async () => {
        // console.time("chapterName" + verseNumber);
        // const chapterName = await getChapterName(chapterNumber);
        // console.timeEnd("chapterName" + verseNumber);
        if (!chapterName) {
            chapterName = await getChapterName(chapterNumber);
        }
        setButtonText(`${chapterNumber}:${verseNumber}\n${chapterName}`);
    }

    const hideVerseNumber = () => {
        setButtonText(<VisibilityIcon />);
    }

    const toggleExpandIcon = () => {
        setExpanded(!expanded);
    }

    const expandButtonPressed = () => {
        readMorePressed();
        toggleExpandIcon();
    }

    useEffect(() => {
        setVerse(verseText);
    }, [verseText]);

    useEffect(() => {
        if (viewVerseNumber) {
            showVerseNumber();
        } else {
            hideVerseNumber();
        }
    }, [viewVerseNumber]);

    useEffect(() => {
        if (expanded) {
            setExpandIcon(<ExpandLessIcon/>);
        }
        else {
            setExpandIcon(<ExpandMoreIcon/>);
        }
    }, [expanded, verseText])

    useEffect(() => {
        setExpanded(false);
    }, [verseText])

    const [leftPosition, setLeftPosition] = useState('50%');

    // ensures expand button remains central in respect to its parent div
    useEffect(() => {
        const expandDiv = document.getElementById('expand-div');
        if (expandDiv) {
            const newPosition = `calc(50% - ${expandDiv.clientWidth / 2}px)`;
            setLeftPosition(newPosition);
        }
    }, []);

    let divRef = useRef();
    // scrolls to make the verse playing in the centre of the screen
    useEffect(() => {
        if (isVersePlaying()) {
            const windowHeight = window.innerHeight;
            const componentHeight = divRef.current.clientHeight;
            const scrollAmount = divRef.current.offsetTop - (windowHeight - componentHeight) / 2;

            window.scrollTo({
            top: scrollAmount,
            behavior: 'smooth'
            });
        }
    }, [versePlaying])

    const expandDivStyle = {
        position: 'absolute',
        left: leftPosition,
    };

    const isVersePlaying = () => {
        return versePlaying && versePlaying.chapterNumber == chapterNumber && versePlaying.verseNumber == verseNumber
    }

    return (
        <div ref={divRef} className={`verse-container ${isVersePlaying() ? 'selected': ''} ${localStorage.getItem('darkMode') === 'false' ? 'light' : 'dark'}`}>
            <Verse verseText={verseText} hideVerse={hideVerse} />
            <div style={{display: 'flex', flexDirection: 'row', margin: '0 auto'}}>
                <div style = {{display: 'flex', flexDirection: 'row'}} id="left-div">
                    <Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        onClick={onViewVerseNumberChange}
                        sx={{ borderRadius: 24 }}
                        id="verse-number">
                            {buttonText}
                    </Button>
                    {showAudioButton !== false ? 
                        (<Button
                            size="medium"
                            style={{display: 'flex', justifyContent: 'flex-start'}}
                            sx={{ borderRadius: 24 }}
                            id="audio"
                            onClick={() => {
                                // document.addEventListener('click', playAudio);
                        
                                playAudio(chapterNumber, verseNumber)
                                // return () => {
                                // document.removeEventListener('click', playAudio);
                                // };
                            }}
                        >
                            {<VolumeUp/>}
                        </Button>) : <></>}
                </div>
                <div style={expandDivStyle} id="expand-div">
                    {verse && readMorePressed ? (
                        <Button
                            onClick={expandButtonPressed} 
                            variant="outlined" 
                            style = {{display: 'flex', justifyContent: 'center'}}
                            sx={ { borderRadius: 24 }}>
                                {expandIcon}
                        </Button>
                    ) : <></>}
                </div>
            </div>
        </div>
    )
}

export default VerseBox;