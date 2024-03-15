// this file is used to fetch the data from the api and store locally. Only needs to be run once
const fs = require('fs');
const fetch = require('node-fetch');
const API_BASE_URL = 'https://api.quran.com/api/v4';

// Utility function for fetch requests
const fetchData = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Fetch all chapters
const fetchAllChapters = async () => {
  const data = await fetchData('/chapters/');
  return data.chapters;
};

// Fetch all verses for a given chapter
const fetchAllVerses = async (chapterNumber) => {
  const data = await fetchData(`/quran/verses/uthmani?chapter_number=${chapterNumber}`);
  return data.verses;
};

// Fetch all reciters
const fetchAllReciters = async () => {
  const data = await fetchData('/resources/recitations');
  return data.recitations;
};

// Fetch audio URLs for multiple verse keys and a single reciter
const fetchAudioUrls = async (reciterNumber, verseKeys) => {
  const urls = await Promise.all(
    verseKeys.map(async (verseKey) => {
      try{
        const data = await fetchData(`/recitations/${reciterNumber}/by_ayah/${verseKey}`);
        return { verse_key: verseKey, url: data.audio_files[0]?.url || null };
      } catch (error) {
        return {verse_key: verseKey, url: "null"}
      }
    })
  );
  return urls;
};

// Fetch all data from the API
const fetchAllData = async () => {
  const chapters = await fetchAllChapters();
  const reciters = await fetchAllReciters();
  const allData = [];

  for (const chapter of chapters) {
    const verses = await fetchAllVerses(chapter.id);
    allData.push({ chapter, verses });
  }

  // this bit is incredibly slow
  // const audio = await Promise.all(
  //   reciters.slice(0, 2).map(async (reciter) => {
  //     const verseKeys = allData.flatMap((data) => data.verses.map((verse) => verse.verse_key));
  //     const recitations = await fetchAudioUrls(reciter.id, verseKeys);
  //     console.log("first reciters recitations: ", recitations);
  //     return { id: reciter.id, recitations };
  //   })
  // );

  return { chapters, reciters, allData };
};

// Store data in a local JSON file
const storeDataLocally = async () => {
  const allData = await fetchAllData();
  fs.writeFileSync('quran_data.json', JSON.stringify(allData, null, 2));
  console.log('Data stored in quran_data.json');
};

storeDataLocally();