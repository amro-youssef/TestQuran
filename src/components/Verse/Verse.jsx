import {React, useState, useEffect, Suspense} from 'react';
import PropTypes from 'prop-types';
import { getV1PageNumber, getV2PageNumber } from '../../backend';
import { fontCache } from './fontCache';
import './Verse.css';

const Verse = ({ verseText, hideVerse, chapterNumber, verseNumber }) => {
    const [isContentHidden, setIsContentHidden] = useState(hideVerse === true);
    // const [fontClass, setFontClass] = useState('');
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
                await fontCache.init();

                if (font.includes('uthmani')) {
                    setFontFamily('uthmanic');
                    setStyle({ letterSpacing: '0px' });
                    setIsFontLoaded(true);
                } else {
                    const pageNumber = font === 'v1' ? 
                        await getV1PageNumber(chapterNumber, verseNumber) : 
                        await getV2PageNumber(chapterNumber, verseNumber);
                    
                    // const fontClass = `${font}_pg${pageNumber}`;
                    // setFontFamily(fontClass);

                    // const fontFace = new FontFace(fontClass, `url(/fonts/${font}/woff2/p${pageNumber}.woff2)`);
                    // await fontFace.load();
                    // document.fonts.add(fontFace);

                    const fontKey = `${font}_pg${pageNumber}`;
                    const fontUrl = `/fonts/${font}/woff2/p${pageNumber}.woff2`;

                    await fontCache.loadFont(fontKey, fontUrl);

                    setFontFamily(fontKey);

                    if (font === 'v1' && pageNumber === 1) {
                        setStyle ({ letterSpacing: '0px', fontSize: '1.3em' });
                    } else if (font === 'v1') {
                        setStyle({ fontSize: '1.1em', letterSpacing: '2px' });
                    } else {
                        setStyle({ letterSpacing: '0px', opacity: 1 })
                    }
                }
                setIsFontLoaded(true);

                // Clear old fonts periodically
                fontCache.clearOldFonts();
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
        return <div >Loading...</div>;
    }

    return (
        <div 
            dir="rtl" 
            className={`verse ${isContentHidden ? 'placeholder blur' : ''} ${localStorage.getItem('darkMode') === 'false' ? '' : 'darkPlaceholder'}`} 
            onClick={makeContentVisibile}
        >
            <div className={`verseText`} style={{ fontFamily, ...style, opacity: isFontLoaded ? 1 : 0, transition: 'opacity 0.3s ease'}} dir="rtl">
                {
                    fontFamily.includes('uthmani') ? processAyah(verseText) : (isFontLoaded ? verseText?.slice(0, -1) : '')
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