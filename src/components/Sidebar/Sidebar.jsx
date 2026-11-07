import {React, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import {getReciters} from '../../backend.js';
import themes from '../../themes.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';

import './Sidebar.css';

export default function Sidebar({ setReciterNumber, showResultsPage, themeColor, changeThemeColor }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [recitersOpen, setRecitersOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(localStorage.getItem('reciterId') ? localStorage.getItem('reciterId') : 6);
  const [continuePlayingAudio, setContinuePlayingAudio] = useState(localStorage.getItem('continuePlayingAudio') === 'false' ? false : true);
  const autoPlayAudio = useSettingsStore((state) => state.autoPlayAudio);
  const setAutoPlayAudio = useSettingsStore((state) => state.setAutoPlayAudio);
  const alwaysHideText = useSettingsStore((state) => state.hideVerse);
  const setAlwaysHideText = useSettingsStore((state) => state.setHideVerse);
  const [reciterComponentList, setReciterComponentList] = useState();
  const [reciterList, setReciterList] = useState([]);
  const [reciterName, setReciterName] = useState();
  const [selectedFont, setSelectedFont] = useState(localStorage.getItem('selectedFont') || 'v1');
  const [randomizeMode, setRandomizeMode] = useState(localStorage.getItem('randomizeMode') || 'byPage');

  useEffect(() => {
    setReciterNumber(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    renderReciters()
  }, []);

  const handleFontChange = (event) => {
    setSelectedFont(event.target.value);
    localStorage.setItem('selectedFont', event.target.value);
  };

  const renderReciters = async () => {
    const reciters = await getReciters();
    setReciterList(reciters)
    for (const reciter of reciters) {
      if (reciter.id == selectedValue) {
        setReciterName(reciter.reciter_name)
        break;
      }
    }
      reciters.sort((a, b) => a.id - b.id)
      const labels = reciters.map((reciter) => (
        <FormControlLabel
          key={reciter.id}
          value={reciter.id}
          control={<Radio />}
          label={reciter.style ? `${reciter.reciter_name} (${reciter.style})` : reciter.reciter_name}
        />
      ));
      setReciterComponentList(labels);
  }

  const handleContinuePlayingChange = (event) => {
    setContinuePlayingAudio(event.target.checked);
    localStorage.setItem('continuePlayingAudio', event.target.checked);
  };

  const handleAutoPlayChange = (event) => {
    setAutoPlayAudio(event.target.checked);
  };

  const handleAlwaysHideText = (event) => {
    setAlwaysHideText(event.target.checked);
  };

  const handleRandomizeModeChange = (event, newMode) => {
    if (newMode !== null) {
      setRandomizeMode(newMode);
      localStorage.setItem('randomizeMode', newMode);
    }
  };

  const list = () => (
    <Box
      className="box"
      style={{display: 'flex', flexDirection: 'column', margin: '15px'}}
      role="presentation"
    >
        {/* <IconButton onClick={handleDrawerClose}>
            {<ChevronRightIcon />}
        </IconButton> */}
        <IconButton onClick={() => setDrawerOpen(false)} style={{position: 'absolute', top: '5px', right: '5px', padding: '5px'}}>
          <CloseIcon fontSize="medium"/>
        </IconButton>
        <h2>Audio:</h2>
        <FormControlLabel checked={autoPlayAudio} onChange={handleAutoPlayChange} control={<Checkbox />} label="Auto-play audio on randomize" />
        <FormControlLabel checked={continuePlayingAudio} onChange={handleContinuePlayingChange} control={<Checkbox />} label="Continue playing audio" />

        <div style={{margin: '5px'}}/>
        <Button variant="outlined" onClick={() => setRecitersOpen(true)}>Reciter: {reciterName}</Button>
        
        <Dialog open={recitersOpen} onClose={() => setRecitersOpen(false)}>
          <DialogTitle>Select Reciter</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                value={selectedValue}
                onChange={(event) => {
                  setSelectedValue(event.target.value);
                  localStorage.setItem('reciterId', event.target.value)
                  for (const reciter of reciterList) {
                    if (reciter.id == event.target.value) {
                      setReciterName(reciter.reciter_name)
                      break;
                    }
                  }
                }}
                name="radio-buttons-group"
              >
                {reciterComponentList}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecitersOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <h2>Verse:</h2>
        <FormControlLabel checked={alwaysHideText} onChange={handleAlwaysHideText} control={<Checkbox />} label="Hide verse text" />

        <FormControl fullWidth style={{marginTop: '10px'}} label="Font">
          <InputLabel id="font-select-label">Font:</InputLabel>
          <Select
            labelId="font-select-label"
            value={selectedFont}
            onChange={handleFontChange}
            label="Font:"
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="v1">King Fahad Complex V1</MenuItem>
            <MenuItem value="v2">King Fahad Complex V2</MenuItem>
            <MenuItem value="uthmani">QPC Uthmani Hafs</MenuItem>
          </Select>
        </FormControl>

        <h2>Theme Color:</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => changeThemeColor(key)}
              title={theme.label}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: theme.swatch,
                border: themeColor === key ? '3px solid currentColor' : '2px solid transparent',
                outline: themeColor === key ? '2px solid ' + theme.swatch : 'none',
                outlineOffset: '2px',
                cursor: 'pointer',
                transition: 'outline 0.15s, border 0.15s',
              }}
            />
          ))}
        </div>

        <h2>Randomizer:</h2>
          <ToggleButtonGroup
            value={randomizeMode}
            exclusive
            onChange={handleRandomizeModeChange}
            aria-label="randomize mode"
            size="small"
          >
          <Tooltip title="Pick a random page, then a verse on it (Recommended)" enterTouchDelay={0} leaveTouchDelay={2000} arrow>
            <ToggleButton value="byPage" aria-label="by page">By Page</ToggleButton>
          </Tooltip>
          <Tooltip title="Pick any verse in the range with equal probability. Pages with more verses are more likely." enterTouchDelay={0} leaveTouchDelay={2000} arrow>
            <ToggleButton value="byVerse" aria-label="by verse">By Verse</ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <h2>Test:</h2>
        <Button variant="outlined" style={{top: '0px'}} onClick={() => {setDrawerOpen(false); showResultsPage();}}>Test Results</Button>
    </Box>
  );

  return (
    <div>
      <Button onClick={() => setDrawerOpen(true)}>{<SettingsIcon/>}</Button>
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}>
            {list()}
      </SwipeableDrawer>
    </div>
  );
}