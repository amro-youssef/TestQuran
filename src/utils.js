import { getVerseV1Glyph, getVerseV2Glyph, getVerseText } from "./backend";

// gets the verse text of the font selected
const getVerseTextOfFont = async (chapterNumber, verseNumber) => {
    // v1 if default font
    const font = localStorage.getItem('selectedFont');
    if (!font || font === 'v1') {
    return await getVerseV1Glyph(chapterNumber, verseNumber);
    } else if (font === 'v2') {
    return await getVerseV2Glyph(chapterNumber, verseNumber);
    } else {
    return await getVerseText(chapterNumber, verseNumber);
}
}

const loadFont = (version, pageNumber) => {
    return new Promise((resolve, reject) => {
      const fontFace = new FontFace(
        `v${version}_pg${pageNumber}`,
        `url(/fonts/v${version}/woff2/p${pageNumber}.woff2) format('woff2'),
         url(/fonts/v${version}/woff/p${pageNumber}.woff) format('woff'),
         url(/fonts/v${version}/ttf/p${pageNumber}.ttf) format('truetype')`
      );
  
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        resolve();
      }).catch(reject);
    });
}

export {getVerseTextOfFont, loadFont};