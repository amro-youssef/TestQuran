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
        const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        // NOTE: this may be very ineffience
        data.verses = data.verses.filter(verse => verse.verse_key == `${chapterNumber}:${verseNumber}`)
        return data.verses[0].text_uthmani
    } catch (error) {
        console.log(error);
        return -1;
    }
}

module.exports = {
    getChapters,
    getChapterNames,
    getNumberVerses,
    getVerseText
};