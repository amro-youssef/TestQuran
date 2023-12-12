import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import './Verse.css';

const Verse = ({ verseText }) => {

    const [verse, setVerse] = useState(verseText);

    useEffect(() => {
        // Update local state when the prop changes
        setVerse(verseText);
    }, [verseText]);
    return (
        // <div className="verse verse-container">
        <div className="verse">
            <h1 dir="rtl">
                {verse}
            </h1>
            {/* <button>
                read more 
            </button> */}
        </div>
    )
}

export default Verse;