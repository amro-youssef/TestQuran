import React, { useState, useEffect, useRef } from 'react';
import './AudioBar.css';
import { Button } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import excludeVariablesFromRoot from '@mui/material/styles/excludeVariablesFromRoot';

const AudioBar = ( {audioFile} ) => {
  // not that audio bar doesnt show fully on mobiles
  const [isPlaying, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioFile) {
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setPlaying(true);
      audioRef.current.play();
    }
  }, [audioFile]);

  const playPauseHandler = () => {
    if (!audioFile) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!isPlaying);
    console.log("is playing", isPlaying)
  };

  // handles pressing of play/pause button on a keyboatd
  useEffect(() => {
    // Add event listener for the 'keydown' event
    const handleKeyDown = (event) => {
      // Check if the pressed key is your keyboard's play/pause button
      // Replace 'YOUR_KEY_CODE' with the actual key code for your keyboard
      console.log(event.keyCode)
      if (event.keyCode == '179') {
        playPauseHandler();
      }
    };
    // console.log("is playing", isPlaying)

    // Attach the event listener to the window
    window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const skipHandler = () => {
    // Implement skip functionality
    // For example: audioRef.current.currentTime += 10; // Skip 10 seconds
  };

  const goBackHandler = () => {
    // Implement go back functionality
    // For example: audioRef.current.currentTime -= 10; // Go back 10 seconds
  };

  const [volume, setVolume] = useState(40);
  const volumeChangeHandler = (e) => {
    const volume = e.target.value;
    setVolume(volume);
    audioRef.current.volume = volume / 100;
  };

  const [time, setTime] = useState(0);
  const timelineChangeHandler = (e) => {
    const relativeTime = e?.target?.value;
    if (relativeTime && audioRef?.current?.currentTime) {
      setTime(relativeTime);
      audioRef.current.currentTime = audioRef.current.duration  * (relativeTime / 100);
    }
  }

  const onEndedHandler = () => {
    setPlaying(false);
    setTime(0);
  }

  const onTimeUpdateHandler = () => {
    // setTime((audioRef.current.currentTime / audioRef.current.duration) * 100);
    const updateInterval = 0.25; // Adjust the interval in milliseconds
    const newTime = (audioRef.current.currentTime / audioRef.current.duration) * 100;

    if (Math.abs(newTime - time) >= updateInterval) {
      // Update the time state only if it has changed significantly
      setTime(newTime);
    }
  };

  function strPadLeft(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  const getCurrentTime = () => {
    if (!audioRef?.current?.currentTime) {
      return "00:00";
    }
    const thisTime = Math.floor(audioRef.current.currentTime);
    const minutes = Math.floor(thisTime / 60);
    const seconds = thisTime - minutes * 60;
    return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2);
  }

  const getEndTime = () => {
    if (!audioRef?.current?.duration) {
      return "00:00";
    }
    const endTime = Math.floor(audioRef.current.duration);
    const minutes = Math.floor(endTime / 60);
    const seconds = endTime - minutes * 60;
    return strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2);
  }

  // add audio bar for length of audio clip so you can scroll through
  // make verse being reciter be highlighted
  return (
    // <div className="bottom-bar" style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
    <div className="bottom-bar" style={{display: 'flex', flexDirection: 'row'}}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <audio
          ref={audioRef} 
          src={audioFile} 
          onEnded={onEndedHandler}
          onTimeUpdate={onTimeUpdateHandler}/>
        <Button onClick={goBackHandler}>
          <SkipPreviousRoundedIcon/>
        </Button>
        <Button
          size="large" 
          onClick={playPauseHandler}>
            {isPlaying ? <PauseIcon/> : <PlayArrowRoundedIcon/>}
        </Button>
        <Button
          onClick={skipHandler}>
            <SkipNextRoundedIcon/>
        </Button>

        <div style={{width: '10px'}}></div>
        <text>{getCurrentTime()} / {getEndTime()} </text>
        <Slider aria-label="timeline" value={time} onChange={timelineChangeHandler} sx={{ width: 300}}/>

        <div style={{width: '20px'}}></div>
        <VolumeDown color = "inherit"/>
        <Slider aria-label="Volume" value={volume} onChange={volumeChangeHandler} sx={{ width: 150 }}/>
        <VolumeUp color = "inherit"/>
      </Stack>
    </div>
  );
};

export default AudioBar;
