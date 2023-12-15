import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeUp from '@mui/icons-material/VolumeUp';
import InfoIcon from '@mui/icons-material/Info';

import Verse from '../Verse/Verse.js';
import './VerseBox.css';

const VerseBox = ({ verseText, readMorePressed, chapterNumber, verseNumber, viewVerseNumber, onViewVerseNumberChange, playAudio, reciterNumber }) => {

    const [verse, setVerse] = useState(verseText);
    const [buttonText, setButtonText] = useState(<VisibilityIcon />);
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon />);
    const [expanded, setExpanded] = useState(false);

    const showVerseNumber = () => {
        setButtonText(`${chapterNumber}:${verseNumber}`)
    }

    const hideVerseNumber = () => {
        setButtonText(<VisibilityIcon />)
    }

    const toggleView = () => {
        onViewVerseNumberChange();
    }

    const toggleExpandIcon = () => {
        setExpanded(!expanded)
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

    return (
        <div className="verse-container">
            <Verse verseText={verseText} />
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style = {{display: 'flex', flexDirection: 'row'}} id="left-div">
                    <Button
                        size="large"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        onClick={toggleView}
                        sx={{ borderRadius: 28 }}
                        id="verse-number">
                            {buttonText}
                    </Button>
                    <Button
                        size="large"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        sx={{ borderRadius: 28 }}
                        id="audio"
                        onClick={() => {
                            playAudio(chapterNumber, verseNumber, reciterNumber)}}
                            >
                            {<VolumeUp/>}
                    </Button>
                </div>
                <div style={{display:'flex', justifyContent: 'center', margin: '0 auto'}} id="expand-div">
                    {verse && readMorePressed ? (
                        <Button
                            onClick={expandButtonPressed} 
                            variant="outlined" 
                            style = {{display: 'flex', justifyContent: 'center'}}
                            sx={ { borderRadius: 28 }}>
                                {expandIcon}
                        </Button>
                    ) : <></>}
                </div>
            </div>
        </div>
    )
}

export default VerseBox;