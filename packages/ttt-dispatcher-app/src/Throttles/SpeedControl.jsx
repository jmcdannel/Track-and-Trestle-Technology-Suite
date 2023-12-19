import React from 'react';
import { Box, ButtonGroup, IconButton } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ThrottleSpeed from './ThrottleSpeed';

export const SpeedControl = ({ 
  uiSpeed, 
  maxSpeed, 
  minSpeed, 
  handleUpClick, 
  handleWayUpClick, 
  handleStopClick, 
  handleDownClick,
  handleWayDownClick
}) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      flex: '1',
      padding: ' 0 0 2rem 0'
    }}>
      <ThrottleSpeed speed={uiSpeed} />

      {/* <Box className="speed-ctrl" sx={{

      }}>
        <button className="speed-ctrl-btn" disabled={uiSpeed === maxSpeed} onClick={handleWayUpClick}><AddIcon /><AddIcon /></button>
        <button className="speed-ctrl-btn" disabled={uiSpeed === maxSpeed} onClick={handleUpClick}><AddIcon /></button>
        <button className="speed-ctrl-btn" onClick={handleStopClick}><PanToolIcon /></button>
        <button className="speed-ctrl-btn" disabled={uiSpeed === minSpeed} onClick={handleDownClick}><RemoveIcon /></button>
        <button className="speed-ctrl-btn" disabled={uiSpeed === minSpeed} onClick={handleWayDownClick}><RemoveIcon /><RemoveIcon /></button>

      </Box> */}
      <ButtonGroup
        orientation="vertical"
        size="large"
        aria-label="vertical outlined primary button group"
        className="throttle__controls__group throttle__advanced-controls"
      >
        <IconButton 
          className="speed-up-btn"
          disabled={uiSpeed === maxSpeed} 
          onClick={handleWayUpClick}>
            <AddIcon />
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-up-btn"
          disabled={uiSpeed === maxSpeed} 
          onClick={handleUpClick}>
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-stop-btn"
          color="primary" 
          onClick={handleStopClick} >
            <PanToolIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn"
          disabled={uiSpeed === minSpeed} 
          onClick={handleDownClick}>
            <RemoveIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn"
          disabled={uiSpeed === minSpeed} 
          onClick={handleWayDownClick}>
            <RemoveIcon />
            <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default SpeedControl;
