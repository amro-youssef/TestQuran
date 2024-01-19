const getChapters = () => {
    return fetch('https://api.quran.com/api/v4/chapters/', {
    method: 'GET',
        headers: { 
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        return response?.chapters;
    })
    .catch((error) => {
        console.log(error);
        return []
    });
}

const getChapterNames = () => {
    return getChapters().then(response => {
        return response.map(chapter => (`${chapter?.id} ${chapter?.name_simple}`))
    });
}

const getChapterName = async (chapterNumber) => {
    try {
        const urlResponse = await fetch(`https://api.quran.com/api/v4/chapters/${chapterNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await urlResponse.json();
        return data.chapter.name_simple;
    } catch (error) {
        console.log(error);
        return null;
    }
}

let audioElement;
const getAudioUrl = async (chapterNumber, verseNumber, reciterNumber) => {
    if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    try {
        const urlResponse = await fetch(`https://api.quran.com/api/v4/recitations/${parseInt(reciterNumber)}/by_ayah/${chapterNumber}:${verseNumber}`, {
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
    try {
        const response = await fetch(`https://api.quran.com/api/v4/chapters/${chapterNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data?.chapter?.verses_count;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

const getVerseText = async (chapterNumber, verseNumber) => {
    try {
        // const response = await fetch(`https://api.quran.com/api/v4/quran/verses/code_v2`, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // });
        // const data = await response.json();
        // // NOTE: this may be very ineffience
        // data.verses = data.verses.filter(verse => verse.verse_key == `${chapterNumber}:${verseNumber}`)
        // return data.verses[0]?.code_v2;

        const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        // NOTE: this may be very ineffience
        data.verses = data.verses.filter(verse => verse.verse_key == `${chapterNumber}:${verseNumber}`)
        return data.verses[0]?.text_uthmani
    } catch (error) {
        console.log(error);
        return -1;
    }
}

const getReciters = async () => {
    try {
        const response = await fetch(`https://api.quran.com/api/v4/resources/recitations`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        return data.recitations;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

module.exports = {
    getChapters,
    getChapterNames,
    getNumberVerses,
    getVerseText,
    getAudioUrl,
    getReciters,
    getChapterName
};