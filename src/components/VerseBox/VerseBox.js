import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeUp from '@mui/icons-material/VolumeUp';
import InfoIcon from '@mui/icons-material/Info';

import Verse from '../Verse/Verse.js';
import './VerseBox.css';

const VerseBox = ({ verseText, readMorePressed, chapterNumber, verseNumber, viewVerseNumber, onViewVerseNumberChange, playAudio }) => {

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
        console.log("expand function", readMorePressed);
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

    // const expandDivStyle = {
    //     position: 'absolute',
    //     left: document.getElementById('expand-div').client_width / 2
    // }

    const [leftPosition, setLeftPosition] = useState('50%');

    // ensures expand button remains central in respect to its parent div
    useEffect(() => {
        const expandDiv = document.getElementById('expand-div');
        if (expandDiv) {
            const newPosition = `calc(50% - ${expandDiv.clientWidth / 2}px)`;
            setLeftPosition(newPosition);
        }
    }, []);

    const expandDivStyle = {
        position: 'absolute',
        left: leftPosition,
    };

    return (
        <div className="verse-container">
            <Verse verseText={verseText} />
            <div style={{display: 'flex', flexDirection: 'row', margin: '0 auto'}}>
                <div style = {{display: 'flex', flexDirection: 'row'}} id="left-div">
                    <Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        onClick={toggleView}
                        sx={{ borderRadius: 24 }}
                        id="verse-number">
                            {buttonText}
                    </Button>
                    <Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        sx={{ borderRadius: 24 }}
                        id="audio"
                        onClick={() => {
                            playAudio(chapterNumber, verseNumber)}}
                            >
                            {<VolumeUp/>}
                    </Button>
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