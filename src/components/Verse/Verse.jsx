import {React, useState, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';
import { getV1PageNumber, getV2PageNumber } from '../../backend';
import './Verse.css';

const Verse = ({ verseText, hideVerse, chapterNumber, verseNumber }) => {
    const [isContentHidden, setIsContentHidden] = useState(hideVerse === true);
    const [fontClass, setFontClass] = useState('');
    const [style, setStyle] = useState({});

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

    useEffect(() => {
        const getFontClass = async () => {
            const font = localStorage.getItem('selectedFont');
            // TODO make this conditional on the font user has selected
            // v1 is the default font
            let pageNumber;
            if (!font || font === 'v1') {
                pageNumber = await getV1PageNumber(chapterNumber, verseNumber);
            } else if (font === 'v2') {
                pageNumber = await getV2PageNumber(chapterNumber, verseNumber);
            } else {
                setFontClass('uthmanic');
                return;
            }
            setFontClass(`${font || 'v1'}_pg` + pageNumber);
        }

        const getStyle = async () => {
            const font = localStorage.getItem('selectedFont');

            if (font === 'v1' || font === null) {
                // letters seem too close together in v1 so this separates them a bit
                setStyle({ fontSize: '1.1em', letterSpacing: '2px' });
            } else {
                // having letter spacing to non-zero causes some issues with uthmani font
                setStyle({ letterSpacing: '0px'});
            }

        }

        getFontClass();
        getStyle();

    }, [chapterNumber, verseNumber]);

    return (
        <div dir="rtl" className={`verse ${isContentHidden ? 'placeholder blur' : ''}`} onClick={makeContentVisibile}>
            <Suspense fallback={<div>Loading...</div>}>
            <div className={`verseText`} style={{fontFamily: fontClass, ...style}} dir="rtl">
                {fontClass.includes('uthmani') ? verseText : verseText?.slice(0, -1)}
            </div>
            </Suspense>
        </div>
    )
}

Verse.propTypes = {
    verseText: PropTypes.string,
    hideVerse: PropTypes.bool
}

export default Verse;