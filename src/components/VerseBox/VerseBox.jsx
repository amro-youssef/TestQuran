/* eslint-disable eqeqeq */
import {React, useState, useEffect, useRef} from 'react';
import { Button } from '@mui/material';
import {getChapterName} from '../../backend.js'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeUp from '@mui/icons-material/VolumeUp';
import ArticleIcon from '@mui/icons-material/Article';
import PropTypes from 'prop-types';

import Verse from '../Verse/Verse.jsx';
import QuranPageDialog from '../QuranPageDialog/QuranPageDialog.jsx';
import './VerseBox.css';

const VerseBox = (props) => {
    let {verseText, readMorePressed, chapterNumber, chapterName, verseNumber, viewVerseNumber,
         onViewVerseNumberChange, playAudio, versePlaying, showAudioButton, hideVerse } = props;

    const [verse, setVerse] = useState(verseText);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [buttonText, setButtonText] = useState(<VisibilityIcon />);
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon />);
    const [expanded, setExpanded] = useState(false);

    const showVerseNumber = async () => {
        if (!chapterName) {
            chapterName = await getChapterName(chapterNumber);
        }
        setButtonText(`${chapterNumber}:${verseNumber}\n${chapterName}`);
    }

    const handleImageDialogOpen = () => {
        setShowImageDialog(true);
    };

    const handleImageDialogClose = () => {
        setShowImageDialog(false);
    };

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
    }, [expanded])

    useEffect(() => {
        setExpanded(false);
    }, [verseText])

    const [leftPosition, setLeftPosition] = useState('50%');

    // ensures expand button remains central in respect to its parent div
    useEffect(() => {
        setTimeout(() => {
            const expandDiv = document.getElementById('expand-div');
            if (expandDiv) {
                const newPosition = `calc(50% - ${expandDiv.clientWidth / 2}px)`;
                setLeftPosition(newPosition);
            }
        }, 100)
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
            <Verse verseText={verseText} hideVerse={hideVerse} chapterNumber={chapterNumber} verseNumber={verseNumber} />
            <div style={{display: 'flex', flexDirection: 'row', margin: '0 auto', justifyContent: 'space-between'}}>
                <div style = {{display: 'flex', flexDirection: 'row'}} id="left-div">
                    {/* <InfoButton/> */}
                    <Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '38vw'}}
                        onClick={onViewVerseNumberChange}
                        sx={{ borderRadius: 24}}
                        id="verse-number">
                            {buttonText}
                    </Button>
                </div>
                {/* <div style={expandDivStyle} id="expand-div"> */}
                <div style={{ position: 'absolute', left: leftPosition }} id="expand-div">
                    {verse && readMorePressed ? (
                        <Button
                            onClick={expandButtonPressed} 
                            variant="outlined" 
                            id="expand-button"
                            style = {{display: 'flex', justifyContent: 'center'}}
                            sx={ { borderRadius: 24 }}>
                                {expandIcon}
                        </Button>
                    ) : <></>}
                </div>
                

                <div style={{ display: 'flex', flexDirection: 'row' }} id="right-div">
                {showAudioButton !== false ? 
                    (<Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start'}}
                        sx={{ borderRadius: 24 }}
                        id="audio"
                        onClick={() => {
                            playAudio(chapterNumber, verseNumber)
                        }}
                    >
                        {<VolumeUp/>}
                    </Button>) : <div></div>}
                    <Button
                        size="medium"
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                        sx={{ borderRadius: 24 }}
                        onClick={handleImageDialogOpen}
                    >
                        <ArticleIcon/>
                    </Button>
                </div>
                
            </div>
            <QuranPageDialog
                open={showImageDialog}
                onClose={handleImageDialogClose}
                chapterNumber={chapterNumber}
                verseNumber={verseNumber}
            />
        </div>
    )
}

VerseBox.propTypes = {
    verseText: PropTypes.string,
    readMorePressed: PropTypes.func,
    chapterNumber: PropTypes.number,
    chapterName: PropTypes.string,
    verseNumber: PropTypes.number,
    viewVerseNumber: PropTypes.bool,
    onViewVerseNumberChange: PropTypes.func,
    playAudio: PropTypes.func,
    allowHideVerse: PropTypes.bool,
    versePlaying: PropTypes.bool,
    showAudioButton: PropTypes.bool,
    hideVerse: PropTypes.bool
}

export default VerseBox;