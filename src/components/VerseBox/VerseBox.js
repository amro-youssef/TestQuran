import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoIcon from '@mui/icons-material/Info';

import Verse from '../Verse/Verse.js';
import './VerseBox.css';

const VerseBox = ({ verseText, readMorePressed, chapterNumber, verseNumber, viewVerseNumber, onViewVerseNumberChange }) => {

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
        if (expanded) {
            setExpandIcon(<ExpandMoreIcon/>)
        } else {
            setExpandIcon(<ExpandLessIcon/>);
        }
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

    return (
        <div className="verse-container">
            <Verse verseText={verseText} />
            <div style = {{display: 'flex', flexDirection: 'row'}}>
                <Button
                    size="large"
                    style={{display: 'flex', justifyContent: 'flex-start'}}
                    onClick={toggleView}>
                        {buttonText}
                </Button>
                {verse && readMorePressed ? (
                    <Button
                        onClick={expandButtonPressed} 
                        variant="outlined" 
                        style = {{display: 'flex', justifyContent: 'center', margin: 'auto'}}>
                            {expandIcon}
                    </Button>
                ) : <></>}
            </div>
        </div>
    )
}

export default VerseBox;