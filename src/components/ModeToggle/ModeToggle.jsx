import React from 'react';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './ModeToggle.css';

const ModeToggle = ({ mode, onChange }) => {
    const isVisual = mode === 'visual';

    const handleChange = () => {
        onChange(isVisual ? 'audio' : 'visual');
    };

    return (
        <div className="mode-toggle">
            <Tooltip
                title="Show the verse on screen"
                enterTouchDelay={0}
                leaveTouchDelay={2000}
                arrow
            >
                <VisibilityIcon
                    className={`mode-icon ${isVisual ? 'active' : ''}`}
                    sx={{ fontSize: 18 }}
                />
            </Tooltip>
            <Switch
                checked={!isVisual}
                onChange={handleChange}
                size="small"
                inputProps={{ 'aria-label': 'toggle test mode' }}
            />
            <Tooltip
                title="Hide the verse and just play audio"
                enterTouchDelay={0}
                leaveTouchDelay={2000}
                arrow
            >
                <HeadphonesIcon
                    className={`mode-icon ${!isVisual ? 'active' : ''}`}
                    sx={{ fontSize: 18 }}
                />
            </Tooltip>
            
        </div>
    );
};

export default ModeToggle;
