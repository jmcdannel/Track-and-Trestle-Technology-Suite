import React from 'react';
import { Paper, ButtonGroup, IconButton } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ThrottleSpeed from './ThrottleSpeed';

export const SpeedControl = ({ 
  uiSpeed, 
  maxSpeed, 
  minSpeed, 
  handleUpClick, 
  handleStopClick, 
  handleDownClick 
}) => {
  return (
    <Paper elevation={3} className="" display="flex" direction="column" square>
      <ThrottleSpeed speed={uiSpeed} />
      <ButtonGroup
        orientation="vertical"
        className="throttle__controls__group"
        aria-label="vertical outlined primary button group"
      >
        <IconButton 
          className="speed-up-btn"
          size="large" 
          disabled={uiSpeed === maxSpeed} 
          onClick={handleUpClick}>
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-stop-btn"
          size="large" 
          color="primary" 
          onClick={handleStopClick} >
            <PanToolIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn"
          size="large" 
          disabled={uiSpeed === minSpeed} 
          onClick={handleDownClick}>
            <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Paper>
  );
};

export default SpeedControl;
