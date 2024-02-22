import React from 'react';
import { Box, ButtonGroup, IconButton } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ThrottleSpeed from './ThrottleSpeed';

import './SpeedControl.scss';

export const SpeedControl = ({ 
  orientation,
  uiSpeed, 
  maxSpeed, 
  minSpeed, 
  handleUpClick, 
  handleWayUpClick, 
  handleStopClick, 
  handleDownClick,
  handleWayDownClick
}) => {

  const btnStlye = {
    padding: {
      xs: '0.25rem 1rem',
      sm: '0.5rem 2rem',
      md: '1rem 2rem',
      lg: '1rem 2rem',
      xl: '1rem 2rem'
    },
    flexDirection: 'row'
  }
  const btnStopStlye = {
    padding: {
      xs: '.75rem 0',
      sm: '.8rem 0',
      md: '1rem 0',
      lg: '1.5rem 0',
      xl: '2rem 0'
    },
    flexDirection: 'row'
  }
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flex: '1',
        padding: ' 0 0 2rem 0'
      }}
      className="speed-control"
      >
      <ThrottleSpeed speed={uiSpeed} />
      <ButtonGroup
        orientation={orientation}
        size="large"
        aria-label="outlined primary button group"
        className="rounded-button-group throttle__controls__group disable-dbl-tap-zoom"
      >
        <IconButton 
          sx={{ display: 'flex', flexDirection: 'row' }}
          className="speed-up-btn disable-dbl-tap-zoom"
          disabled={uiSpeed === maxSpeed} 
          style={btnStlye}
          onClick={handleWayUpClick}>
            <AddIcon />
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-up-btn disable-dbl-tap-zoom"
          disabled={uiSpeed === maxSpeed} 
          style={btnStlye}
          onClick={handleUpClick}>
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-stop-btn disable-dbl-tap-zoom"
          color="primary" 
          style={btnStopStlye}
          onClick={handleStopClick} >
            <PanToolIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn disable-dbl-tap-zoom"
          disabled={uiSpeed === minSpeed} 
          style={btnStlye}
          onClick={handleDownClick}>
            <RemoveIcon />
        </IconButton>
        <IconButton 
          sx={{ display: 'flex', flexDirection: 'row' }}
          className="speed-down-btn disable-dbl-tap-zoom"
          disabled={uiSpeed === minSpeed} 
          style={btnStlye}
          onClick={handleWayDownClick}>
            <RemoveIcon />
            <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default SpeedControl;
