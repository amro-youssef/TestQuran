import {React, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './Verse.css';

const Verse = ({ verseText, hideVerse }) => {
    const [verse, setVerse] = useState(verseText);
    const [isContentHidden, setIsContentHidden] = useState(hideVerse === true);

    const makeContentVisibile = () => {
        setIsContentHidden(false);
    };

    // useEffect(() => {
    //     // if (hideVerse) {
    //     //     setIsContentHidden(true);
    //     // }
    //     if (localStorage.getItem('alwaysHideVerse') === "true" && allowHideVerse) {
    //         setIsContentHidden(true);
    //     } else {
    //         setIsContentHidden(false);
    //     }
    //     setVerse(verseText);
    // }, [verseText]);
    return (
        // <>
        // {isContentHidden && 
        // <div className={`verse ${isContentHidden ? 'placeholder' : ''}`} onClick={toggleContentVisibility}>
        //     <h1 dir="rtl">
        //         {verse}
        //     </h1>
        // </div>}
        // </>
        <div dir="rtl" className={`verse ${isContentHidden ? 'placeholder blur' : ''}`} onClick={makeContentVisibile}>
            <div className='verseText' dir="rtl">
                {verseText}
            </div>
        </div>
    )
}

Verse.propTypes = {
    verseText: PropTypes.string,
    hideVerse: PropTypes.bool
}

export default Verse;