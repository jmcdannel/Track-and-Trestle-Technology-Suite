import React, { useContext, useState}  from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

import { Context } from '../Store/Store';
import { useBreakpoints } from '../Shared/hooks/useBreakpoints';

const ThrottleActions = (props) => {

  const { 
    onShowSettings, 
    onShowFunctions, 
    onShowConsist,
    onStop, 
    cruiseDisabled, 
    size = 'large' ,
    showFunctions = true,
    showCruiseControl = true,
    showPark = true,
    showSettings = true
  } = props;
  const address = Number(props.loco.address);

  const [ , dispatch ] = useContext(Context);
  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();

  const iconStyle = size === 'large' ? { fontSize: '2rem' } : { fontSize: '1.4rem' };

  const handleShowFunctionClick = () => {
    onShowFunctions();
  }

  const handleShowSettingsClick = () => {
    onShowSettings();
  }

  const handleCruiceControlClick = async () => {
    try {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, cruiseControl: true } });
    } catch (err) {
      console.error(err);
    }
  }

  const handleConsistClick = () => {
    onShowConsist();
  }

  const handleParkClick = async () => {
    try {
      onStop();
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, cruiseControl: false } });
    } catch (err) {
      console.error(err);
    }    
  }

  return (    
    <>
      <slot></slot>
        <Tooltip title="Functions">
          <IconButton 
            className="functions"
            onClick={handleShowFunctionClick} 
            size={size}>
            <TrainIcon sx={iconStyle} />
          </IconButton>
        </Tooltip>
      <Tooltip title="Cruise Control">
        <IconButton 
          className="cruise-control"
          onClick={handleCruiceControlClick} 
          disabled={cruiseDisabled} 
          size={size}>
          <SpeedIcon sx={iconStyle} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Park">
        <IconButton 
          className="park"
          onClick={handleParkClick}
          size={size}>
          <LocalParkingIcon sx={iconStyle} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Consist">
        <IconButton 
          onClick={handleConsistClick}
          size={size}>
          <Box sx={{ position: 'relative' }}>
            <TrainIcon sx={{...iconStyle, ...{ fontSize: '1rem', position: 'relative', left: '-5px', top: '-5px'}}} />
            <TrainIcon sx={{...iconStyle, ...{ fontSize: '1rem', position: 'absolute', left: '5px', top: '5px', color: '#00FF00' }}} />
            </Box>
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings">
        <IconButton 
          className="settings"
          onClick={handleShowSettingsClick}
          size={size}>
          <SettingsIcon sx={iconStyle} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ThrottleActions;
