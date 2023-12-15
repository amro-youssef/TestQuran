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


export default function SwipeableTemporaryDrawer({ setReciterNumber }) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [selectedValue, setSelectedValue] = useState(6);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleDrawerClose = () => {
    setState({...state, ['right']: false});
  };

  useEffect(() => {
    setReciterNumber(selectedValue);
  }, [selectedValue]);

  const list = (anchor) => (
    <Box
      style={{display: 'flex', flexDirection: 'column', margin: '15px'}}
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 350 }}
      role="presentation"
    //   onClick={toggleDrawer(anchor, false)}
    //   onKeyDown={toggleDrawer(anchor, false)}
    >
        <IconButton onClick={handleDrawerClose}>
            {<ChevronRightIcon />}
        </IconButton>
        <h2>Audio:</h2>
        <FormControlLabel control={<Checkbox />} label="Auto-play Audio" />
        <FormControlLabel control={<Checkbox />} label="Continue playing audio" />

        <br/>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Select Reciter</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                // defaultValue="Abdul Basit"
                value = {selectedValue}
                onChange={(event) => {
                    setSelectedValue(event.target.value);
                    setReciterNumber(event.target.value);
                }}
                name="radio-buttons-group"
            >
                <FormControlLabel value="6" control={<Radio />} label="Husary" />
                <FormControlLabel value="1" control={<Radio />} label="Abdul Basit 'Abd us-Samad" />
                <FormControlLabel value="..." control={<Radio />} label="..." />
            </RadioGroup>
        </FormControl>
        <Divider/>
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