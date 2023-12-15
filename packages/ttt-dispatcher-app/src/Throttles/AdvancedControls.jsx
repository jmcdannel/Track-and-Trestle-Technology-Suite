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

import Functions from './Functions';

import { Context } from '../Store/Store';

const AdvancedControls = (props) => {

  const { 
    onShowSettings, 
    onShowFunctions, 
    onStop, 
    onFunctionClick,
    cruiseDisabled, 
    handleFunctionClick,
    loco,
  } = props;
  const address = Number(props.loco.address);

  const [ , dispatch ] = useContext(Context);

  const iconStyle = { fontSize: '3rem' };

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

  const handleParkClick = async () => {
    try {
      onStop();
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, speed: 0, cruiseControl: false } });
    } catch (err) {
      console.error(err);
    }    
  }

  return (    
    <Box className="height100"  flex="1" alignItems="center" display="flex" flexDirection="column" >
      <slot></slot>
      <Functions onFunctionClick={handleFunctionClick} functionMap={loco.functions} />
      <Box flex="1" alignItems="end" display="flex" justifyContent="space-evenly" sx={{ width: '100%', pb: 4 }}>
        <Tooltip title="Cruise Control">
          <IconButton 
            className="cruise-control"
            onClick={handleCruiceControlClick} 
            disabled={cruiseDisabled} 
            sx={iconStyle}>
            <SpeedIcon sx={iconStyle} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Park">
          <IconButton 
            className="park"
            onClick={handleParkClick} 
            sx={iconStyle}>
            <LocalParkingIcon sx={iconStyle} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AdvancedControls;
