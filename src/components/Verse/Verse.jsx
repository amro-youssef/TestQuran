import {React, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './Verse.css';

const Verse = ({ verseText, hideVerse }) => {
    const [verse, setVerse] = useState(verseText);
    const [isContentHidden, setIsContentHidden] = useState(hideVerse === true);

    const makeContentVisibile = () => {
        setIsContentHidden(false);
    };

    // credit to https://github.com/AShaaban0109/QuranType for this function
    function processAyah(ayah) {
        if (!ayah || ayah === "") {
            return ayah;
        }
    
        // handle iqlab. 
        ayah = ayah.replace(/\u064B\u06E2/g, '\u064E\u06E2'); // fathateen then meen, to fatha then meen.
        ayah = ayah.replace(/\u064C\u06E2/g, '\u064F\u06E2'); // dammateen then meen, to damma then meen.
        ayah = ayah.replace(/\u064D\u06ED/g, '\u0650\u06ED'); // kasrateen then meen, to kasra then meen.
    
        return ayah
    }

    return (
        <div dir="rtl" className={`verse ${isContentHidden ? 'placeholder blur' : ''}`} onClick={makeContentVisibile}>
            <div className='verseText' dir="rtl">
                {processAyah(verseText)}
            </div>
        </div>
    )
}

Verse.propTypes = {
    verseText: PropTypes.string,
    hideVerse: PropTypes.bool
}

export default Verse;