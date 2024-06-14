/* eslint-disable eqeqeq */
import {React, useState, useEffect, useRef} from 'react';
import { Button } from '@mui/material';
import {getChapterName} from '../../backend.js'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeUp from '@mui/icons-material/VolumeUp';
import PropTypes from 'prop-types';

import Verse from '../Verse/Verse.jsx';
import InfoButton from '../InfoButton/InfoButton.jsx';

import './VerseBox.css';

const VerseBox = (props) => {
    let { verseText, readMorePressed, chapterNumber, chapterName, verseNumber, viewVerseNumber, onViewVerseNumberChange, playAudio, versePlaying, showAudioButton, hideVerse } = props;

    const [verse, setVerse] = useState(verseText);
    const [buttonText, setButtonText] = useState(<VisibilityIcon />);
    const [expandIcon, setExpandIcon] = useState(<ExpandMoreIcon />);
    const [expanded, setExpanded] = useState(false);

    const showVerseNumber = async () => {
        if (!chapterName) {
            chapterName = await getChapterName(chapterNumber);
        }
        // setButtonText(`v${verseNumber}\n${chapterName}`);

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
                    {/* <InfoButton/> */}
                    <Button
                        size="medium"
                        style={{display: 'flex', justifyContent: 'flex-start', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '28vw'}}
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
                                // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                playAudio(chapterNumber, verseNumber)
                                // if (false) {
                                //     // this.addEventListener('click', playAudio(chapterNumber, verseNumber))
                                //     playAudio(chapterNumber, verseNumber)
                                // } else {
                                //     navigator.mediaDevices
                                //         .getUserMedia({ audio: true })
                                //         .then((stream) => {
                                //             playAudio(chapterNumber, verseNumber, stream);
                                //         })
                                //         .catch((error) => {
                                //         console.error('Error requesting audio permission:', error);
                                //     // Handle the case where the user denies permission
                                //     });
                                // }
                                // return () => {
                                // document.removeEventListener('click', playAudio);
                                // };
                            }}
                        >
                            {<VolumeUp/>}
                        </Button>) : <div></div>}
                </div>
                <div style={expandDivStyle} id="expand-div">
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
            </div>
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