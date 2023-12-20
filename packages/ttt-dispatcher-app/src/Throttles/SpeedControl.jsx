import React from 'react';
import { Box, ButtonGroup, IconButton } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ThrottleSpeed from './ThrottleSpeed';
import { useBreakpoints } from '../Shared/hooks/useBreakpoints';

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
  
  const [ isXs, isSm, isMd, isLg, isXl, getCurrentSize ] = useBreakpoints();

  const btnStlye = {
    padding: {
      xs: '0.5rem 2rem',
      sm: '0.5rem 2rem',
      md: '1rem 2rem',
      lg: '1rem 2rem',
      xl: '1rem 2rem'
    }
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
        className="rounded-button-group throttle__controls__group"
      >
        <IconButton 
          className="speed-up-btn"
          disabled={uiSpeed === maxSpeed} 
          style={btnStlye}
          onClick={handleWayUpClick}>
            <AddIcon />
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-up-btn"
          disabled={uiSpeed === maxSpeed} 
          style={btnStlye}
          onClick={handleUpClick}>
            <AddIcon />
        </IconButton>
        <IconButton 
          className="speed-stop-btn"
          color="primary" 
          style={btnStlye}
          onClick={handleStopClick} >
            <PanToolIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn"
          disabled={uiSpeed === minSpeed} 
          style={btnStlye}
          onClick={handleDownClick}>
            <RemoveIcon />
        </IconButton>
        <IconButton 
          className="speed-down-btn"
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
