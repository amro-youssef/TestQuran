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

let audioElement;
const getAndPlayAudio = async (chapterNumber, verseNumber, reciterNumber) => {
    // if (isAudioPlaying) {
    //     console.log("Audio is already playing. Cannot start a new instance.");
    //     return;
    // }
    // may be better to split this method into a get audio file and play audio file method
    const paddedChapterNumber = String(chapterNumber).padStart(3, '0');
    const paddedVerseNumber = String(verseNumber).padStart(3, '0');

    if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }

    try {
        // const response = await fetch(`https://verses.quran.com/AbdulBaset/Murattal/mp3/${paddedChapterNumber}${paddedVerseNumber}.mp3`, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // });
        const urlResponse = await fetch(`https://api.quran.com/api/v4/recitations/${parseInt(reciterNumber)}/by_ayah/${chapterNumber}:${verseNumber}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await urlResponse.json();
        console.log(data)
        // strangely the api sometimes returns a direct link to the mp3, and sometimes it gives the end part

        let response;
        let audioBlob;
        console.log(data.audio_files[0].url)
        try {
            console.log("try")
            response = await fetch("https://verses.quran.com/" + data.audio_files[0].url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                response = await fetch(data.audio_files[0].url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            }
            audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElement = new Audio();
            audioElement.src = audioUrl;
            audioElement.play();
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

module.exports = {
    getChapters,
    getChapterNames,
    getNumberVerses,
    getVerseText,
    getAndPlayAudio
};