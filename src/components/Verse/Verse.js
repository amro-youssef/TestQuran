import {React, useState, useEffect} from 'react';
import { Button } from '@mui/material';
import './Verse.css';

const Verse = ({ verseText }) => {

    const [verse, setVerse] = useState(verseText);

    useEffect(() => {
        setVerse(verseText);
    }, [verseText]);
    return (
        <div className="verse">
            <h1 dir="rtl">
                {verse}
            </h1>
        </div>
    )
}

export default Verse;