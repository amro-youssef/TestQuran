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

const getReciters = async () => {
    const localData = await getLocalData();
    return localData.reciters;
}

export {
    getChapters,
    getChapterNames,
    getNumberVerses,
    getVerseText,
    getAudioUrl,
    getReciters,
    getChapterName
};