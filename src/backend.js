/* eslint-disable eqeqeq */
/**
 * new backend with most of data now stored locally
 */
// import data from './quran_data.json' assert { type: 'json' };

// const data = require("./quran_data.json");
import data from "./quran_data.json";

const API_BASE_URL = 'https://api.quran.com/api/v4';

const loadLocalData = async () => {
    try {
        // const response = await fetch('/src/quran_data.json');
        // const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error reading local data:', err);
        return null;
      }
}


const getLocalData = async () => {
    if (!getLocalData.cache) {
      getLocalData.cache = await loadLocalData();
    }
    return getLocalData.cache;
  };

const getChapters = async () => {
    const localData = await getLocalData();
    return localData ? localData.chapters : [];
}

const getChapterNames = async () => {
    const chapters = await getChapters();
    return chapters.map((chapter) => `${chapter.id} ${chapter.name_simple}`);
}

const getChapterName = async (chapterNumber) => {
    const chapters = await getChapters();
    const chapter = chapters.find((chapter) => chapter.id === chapterNumber);
    return chapter ? chapter.name_simple : null;
}

let audioElement;
// this is currently the only thing still using the api since retrieving all
// the urls is a very long process so it was skipped
const getAudioUrl = async (chapterNumber, verseNumber, reciterNumber) => {
    if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    try {
        const urlResponse = await fetch(`${API_BASE_URL}/recitations/${parseInt(reciterNumber)}/by_ayah/${chapterNumber}:${verseNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await urlResponse.json();

        try {
            return data.audio_files[0].url;
        } catch (error) {
            console.log("Failed to play audio")
        }

    } catch (error) {
        console.log(error);
        return -1;
    }
}

const getNumberVerses = async (chapterNumber) => {
    const localData = await getLocalData();
    const chapter = localData.allData.find((data) => data.chapter.id === chapterNumber);
    return chapter ? chapter.verses.length : -1;
}

const getVerseText = async (chapterNumber, verseNumber) => {
    const localData = await getLocalData();
    const data = localData.allData.find((data) => data.chapter.id === chapterNumber);
    const verseKey = chapterNumber + ":" + verseNumber;
    const verse = data.verses.find(v => v.verse_key === verseKey);
    return verse ? verse.text_uthmani : verse;
}

const getVerseV1Glyph = async (chapterNumber, verseNumber) => {
    const localData = await getLocalData();
    const data = localData.allData.find((data) => data.chapter.id === chapterNumber);
    const verseKey = chapterNumber + ":" + verseNumber;
    const verse = data.versesV1.find(v => v.verse_key === verseKey);
    return verse ? verse.code_v1 : verse;
}

const getVerseV2Glyph = async (chapterNumber, verseNumber) => {
    const localData = await getLocalData();
    const data = localData.allData.find((data) => data.chapter.id === chapterNumber);
    const verseKey = chapterNumber + ":" + verseNumber;
    const verse = data.versesV2.find(v => v.verse_key === verseKey);
    return verse ? verse.code_v2 : verse;
}

const getV1PageNumber = async (chapterNumber, verseNumber) => {
    const localData = await getLocalData();
    const data = localData.allData.find((data) => data.chapter.id === chapterNumber);
    const verseKey = chapterNumber + ":" + verseNumber;
    const verse = data.versesV1.find(v => v.verse_key === verseKey);
    return verse ? verse.v1_page : verse;
}

const getV2PageNumber = async (chapterNumber, verseNumber) => {
    const localData = await getLocalData();
    const data = localData.allData.find((data) => data.chapter.id === chapterNumber);
    const verseKey = chapterNumber + ":" + verseNumber;
    const verse = data.versesV2.find(v => v.verse_key === verseKey);
    return verse ? verse.v2_page : verse;
}

const getReciters = async () => {
    const localData = await getLocalData();
    return localData.reciters;
}

// Every verse in mushaf order, plus where each chapter and page starts in that order.
// Built once so picking a verse by page doesn't rescan the data on every pick.
const getPageIndex = async () => {
    if (!getPageIndex.cache) {
        const localData = await getLocalData();
        const verses = [];
        const chapterStart = {};
        const pageRange = {};
        for (const chapterData of localData.allData) {
            const chapterNumber = chapterData.chapter.id;
            chapterStart[chapterNumber] = verses.length;
            chapterData.versesV1.forEach((v, i) => {
                const page = v.v1_page;
                if (!pageRange[page]) {
                    pageRange[page] = [verses.length, verses.length];
                }
                pageRange[page][1] = verses.length;
                verses.push({ chapterNumber, verseNumber: i + 1, page });
            });
        }
        getPageIndex.cache = { verses, chapterStart, pageRange };
    }
    return getPageIndex.cache;
};

/**
 * Picks a random page that has a verse in the list, then a random listed verse on that page.
 * The list can have gaps (e.g. Al-Mulk and Juz 30), so pages with nothing selected are never picked.
 * randFloat returns a float in [0, 1).
 */
const getRandomVerseByPage = async (verseList, randFloat = Math.random) => {
    const { verses, chapterStart } = await getPageIndex();
    const versesByPage = new Map();
    for (const verse of verseList) {
        const page = verses[chapterStart[verse.chapterNumber] + verse.verseNumber - 1].page;
        if (!versesByPage.has(page)) {
            versesByPage.set(page, []);
        }
        versesByPage.get(page).push(verse);
    }
    const pages = [...versesByPage.values()];
    const onPage = pages[Math.floor(randFloat() * pages.length)];
    const { chapterNumber, verseNumber } = onPage[Math.floor(randFloat() * onPage.length)];
    return { chapterNumber, verseNumber };
};

export {
    getChapters,
    getChapterNames,
    getNumberVerses,
    getVerseText,
    getAudioUrl,
    getReciters,
    getChapterName,
    getVerseV1Glyph,
    getVerseV2Glyph,
    getV1PageNumber,
    getV2PageNumber,
    getRandomVerseByPage
};