import {React, useState, useEffect} from 'react';
import './Verse.css';

const Verse = ({ verseText }) => {

    const [verse, setVerse] = useState(verseText);

    useEffect(() => {
        // Update local state when the prop changes
        setVerse(verseText);
    }, [verseText]);
    return (
        <div>
            <h1 dir="rtl" className="verse verse-container">
                {verse}
            </h1>
        </div>
    )
}

export default Verse;