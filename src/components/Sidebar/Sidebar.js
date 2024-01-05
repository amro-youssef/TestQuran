import {React, useState, useEffect, Fragment} from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {getReciters} from './../../backend.js';
import './Sidebar.css';

export default function SwipeableTemporaryDrawer({ setReciterNumber }) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
    reciters: false
  });
  const [selectedValue, setSelectedValue] = useState(localStorage.getItem('reciterId') ? localStorage.getItem('reciterId') : 6);
  const [reciterComponentList, setReciterComponentList] = useState();
  const [reciterList, setReciterList] = useState([]);
  const [reciterName, setReciterName] = useState();

  useEffect(() => {
    for (const reciter of reciterList) {
      if (reciter.id == selectedValue) {
        setReciterName(reciter.reciter_name)
        break;
      }
    }
  }, []);

  const toggleDrawer = (anchor) => () => {
    setState({ ...state, [anchor]: !state[anchor] });
  };

  const CollapsiblePanel = ({ isOpen, children }) => {
    return (
      <div style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden', transition: 'height 0.3s ease-in-out' }}>
        {children}
      </div>
    );
  };

  const handleDrawerClose = () => {
    setState({...state, ['right']: false});
  };

  useEffect(() => {
    const fetchReciters = async () => {
      const reciters = await getReciters();
      setReciterList(reciters);
      for (const reciter of reciters) {
        if (reciter.id == selectedValue) {
          setReciterName(reciter.reciter_name)
          break;
        }
      }
    };
    fetchReciters();
  }, []);

  useEffect(() => {
    setReciterNumber(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    renderReciters()
  }, []);

  const renderReciters = async () => {
    const reciters = await getReciters();
    setReciterList(reciters)
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

  const list = (anchor) => (
    <Box
      className="box"
      style={{display: 'flex', flexDirection: 'column', margin: '15px'}}
      // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    >
        {/* <IconButton onClick={handleDrawerClose}>
            {<ChevronRightIcon />}
        </IconButton> */}
        <h2>Audio:</h2>
        <FormControlLabel control={<Checkbox />} label="Auto-play Audio" />
        <FormControlLabel control={<Checkbox />} label="Continue playing audio" />

        <div style={{margin: '5px'}}/>
        {/* <br/> */}
        {/* <CollapsiblePanel isOpen={state.reciters}>

        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Select Reciter</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value = {selectedValue}
                onChange={(event) => {
                    setSelectedValue(event.target.value);
                    setReciterNumber(event.target.value);
                }}
                name="radio-buttons-group"
            >
                {reciterList}
            </RadioGroup>
        </FormControl>
        </CollapsiblePanel> */}
        <Button variant="outlined" onClick={toggleDrawer('reciters')}>Reciter: {reciterName}</Button>
        
        <Dialog open={state.reciters} onClose={toggleDrawer('reciters')}>
          <DialogTitle>Select Reciter</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                value={selectedValue}
                onChange={(event) => {
                  setSelectedValue(event.target.value);
                  localStorage.setItem('reciterId', event.target.value)
                  setReciterNumber(event.target.value);
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
            <Button onClick={toggleDrawer('reciters')}>Close</Button>
          </DialogActions>
        </Dialog>

        <h2>Verse:</h2>
        <FormControlLabel control={<Checkbox />} label="Always hide verse number" />
        <FormControlLabel control={<Checkbox />} label="Always hide text" />

    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{<SettingsIcon/>}</Button>
          <SwipeableDrawer
            permanent = "true"
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}>
                {list(anchor)}
          </SwipeableDrawer>
        </Fragment>
      ))}
    </div>
  );
}