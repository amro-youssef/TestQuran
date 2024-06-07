import React, { useState } from 'react';
import './InfoButton.css';
import {Button} from '@mui/material';

const InfoButton = () => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="info-button-container">
      <Button onClick={toggleInfo} className="info-button">
        ℹ️
      </Button>
      {showInfo && (
        <div className="info-dialog">
          This is example information for an InfoLabel. <a href="#">Learn more</a>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
