import {React, useState, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';
import { getV1PageNumber, getV2PageNumber } from '../../backend';
import { useTheme } from '@mui/material';
import './Verse.css';

const Verse = ({ verseText, hideVerse, chapterNumber, verseNumber }) => {
    const [isContentHidden, setIsContentHidden] = useState(hideVerse === true);
    const [fontClass, setFontClass] = useState('');
    const [fontFamily, setFontFamily] = useState('');
    const [style, setStyle] = useState({});
    const [isFontLoaded, setIsFontLoaded] = useState(false);

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

    // get the font file for v1 or v2 fonts
    useEffect(() => {
        const font = localStorage.getItem('selectedFont') || 'v1';
        
        const loadFont = async () => {
            try {
                let pageNumber;
                if (font.includes('uthmani')) {
                    setFontFamily('uthmanic');
                    setStyle({ letterSpacing: '0px' });
                } else {
                    pageNumber = font === 'v1' ? 
                        await getV1PageNumber(chapterNumber, verseNumber) : 
                        await getV2PageNumber(chapterNumber, verseNumber);
                    
                    const fontClass = `${font}_pg${pageNumber}`;
                    setFontFamily(fontClass);

                    const fontFace = new FontFace(fontClass, `url(/fonts/${font}/woff2/p${pageNumber}.woff2)`);
                    await fontFace.load();
                    document.fonts.add(fontFace);

                    setStyle(font === 'v1' && pageNumber !== 1 ? 
                        { fontSize: '1.1em', letterSpacing: '2px' } : 
                        { letterSpacing: '0px' }
                    );
                }
                setIsFontLoaded(true);
            } catch (error) {
                console.error('Failed to load font:', error);
                setIsFontLoaded(true); // Set to true to fall back to default font
            }
        };

        loadFont();
    }, [chapterNumber, verseNumber, verseText]);

    useEffect(() => {
        setIsContentHidden(hideVerse === true);
    }, [verseText]);

    if (!isFontLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div 
            dir="rtl" 
            className={`verse ${isContentHidden ? 'placeholder blur' : ''} ${localStorage.getItem('darkMode') !== 'true' ? '' : 'dark'}`} 
            onClick={makeContentVisibile}
        >
            <div className={`verseText`} style={{ fontFamily, ...style }} dir="rtl">
                {isFontLoaded ?
                    fontClass.includes('uthmani') ? processAyah(verseText) : verseText?.slice(0, -1)
                    : ''
                }
            </div>
        </div>
    )
}

Verse.propTypes = {
    verseText: PropTypes.string,
    hideVerse: PropTypes.bool
}

export default Verse;