import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import './Verse.css';

const Verse = ({ verseText, hideVerse }) => {
    const [verse, setVerse] = useState(verseText);
    const [isContentHidden, setIsContentHidden] = useState(false);

    const makeContentVisibile = () => {
        setIsContentHidden(false);
    };

    useEffect(() => {
        // if (hideVerse) {
        //     setIsContentHidden(true);
        // }
        if (localStorage.getItem('alwaysHideVerse') === "true" && hideVerse) {
            setIsContentHidden(true);
        } else {
            setIsContentHidden(false);
        }
        setVerse(verseText);
    }, [verseText]);
    return (
        // <>
        // {isContentHidden && 
        // <div className={`verse ${isContentHidden ? 'placeholder' : ''}`} onClick={toggleContentVisibility}>
        //     <h1 dir="rtl">
        //         {verse}
        //     </h1>
        // </div>}
        // </>
        <div className={`verse ${isContentHidden ? 'placeholder blur' : ''}`} onClick={makeContentVisibile}>
            <h1 dir="rtl">
                {verse}
            </h1>
        </div>
    )
}

export default Verse;