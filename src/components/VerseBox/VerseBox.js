import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import Verse from '../Verse/Verse.js';
import './VerseBox.css';

const VerseBox = ({ verseText, readMorePressed }) => {

    const [verse, setVerse] = useState(verseText);

    useEffect(() => {
        // Update local state when the prop changes
        setVerse(verseText);
    }, [verseText]);
    return (
        <div className="verse-container">
            <Verse verseText={verseText} />
            {verse && readMorePressed ? (
                <Button onClick={readMorePressed}>
                    read more 
                </Button>
            ) : <></>}
        </div>
    )
}

export default VerseBox;