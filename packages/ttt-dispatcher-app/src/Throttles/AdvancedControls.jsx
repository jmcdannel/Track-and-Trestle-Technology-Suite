import React, { useState}  from 'react';
import axios from  'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import ExpandIcon from '@mui/icons-material/Expand';
import CompressIcon from '@mui/icons-material/Compress';

import { PrecisionDialog } from './PrecisionDialog';
import { useLocoStore } from '../Store/useLocoStore';
import { useThrottleStore } from '../Store/useThrottleStore';

import './AdvancedControls.scss';

const AdvancedControls = (props) => {

  const { 
    onShowFunctions, 
    onShowConsist,
    onStop, 
    cruiseDisabled, 
    loco
  } = props;
  const address = Number(loco.address);

  const updateLoco = useLocoStore(state => state.updateLoco);
  const deleteThrottle = useThrottleStore(state => state.deleteThrottle);

  const [showPrecision, setShowPrecision] = useState(false);


  const handleCruiceControlClick = async () => {
    try {
      await updateLoco( { address, cruiseControl: true });
    } catch (err) {
      console.error(err);
    }
  }

  const handleAutoStopClick = async () => {
    try {
      await updateLoco( { address, autoStop: !loco.autoStop });
    } catch (err) {
      console.error(err);
    }
  }

  const handlePrecisionClick = async () => {
    setShowPrecision(true)
  }

  const handleConsistClick = async () => {
    onShowConsist()
  }


  const handleFunctionClick = async () => {
    onShowFunctions()
  }

  const handleParkClick = async () => {
    try {
      onStop();
      await updateLoco( { address, isAcquired: false, cruiseControl: false });
      await deleteThrottle(address);
    } catch (err) {
      console.error(err);
    }    
  }

  const setPrecision = async (maxSpeed) => {
    try {
      setShowPrecision(false)
      await updateLoco( { address, maxSpeed });
    } catch (err) {
      console.error(err);
    }
  }

  const buttonStyle = {
    display: {
      xs: 'none',
      sm: 'block',
      md: 'block',
      lg: 'block',
      xl: 'block'
    }
  }
  const iconStyle = {
    fontSize: {
      xs: '.5rem',
      sm: '.75rem',
      md: '.8rem',
      lg: '1rem',
      xl: '1.2rem'
    }
  }

  const buttonLabelStyle = {
    display: {
      xs: 'none',
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'block'
    }
  }

  return (    
    <Box className="height100" sx={{ pb: '2rem' }} flex="1" alignItems="center" display="flex" justifyContent="flex-end" flexDirection="column" >
      <slot></slot>
      <ButtonGroup
        variant="text"
        size="large"
        className="rounded-button-group throttle__advanced-controls">
        <Tooltip title="Cruise Control">
          <Button 
            onClick={handleCruiceControlClick}
            sx={buttonStyle}
            startIcon={<SpeedIcon sx={iconStyle} />} 
          >
            <Box sx={buttonLabelStyle}>
              Cruise Control
            </Box>
          </Button>
        </Tooltip>
        <Tooltip title="Functions">
          <Button 
            onClick={handleFunctionClick} 
            disabled={cruiseDisabled}
            sx={buttonStyle}
            startIcon={<TrainIcon sx={iconStyle} />} 
          >
            <Box sx={buttonLabelStyle}>
            Functions
            </Box>
          </Button>
        </Tooltip>
        <Tooltip title="Auto Stop">
          <Button 
            onClick={handleAutoStopClick} 
            sx={buttonStyle}
            startIcon={loco.autoStop  ? <CompressIcon sx={iconStyle} /> : <ExpandIcon  sx={iconStyle} />}>
            <Box sx={buttonLabelStyle}>
              Auto Stop
            </Box>
          </Button>
        </Tooltip>
        <Tooltip title="Precision">
          <Button 
            sx={buttonStyle}
            onClick={handlePrecisionClick} 
            startIcon={<ThermostatAutoIcon sx={iconStyle} />}>
            <Box sx={buttonLabelStyle}>
              Precision
            </Box>
          </Button>
        </Tooltip>
        <Tooltip title="Cruise Control">
          <Button 
            sx={buttonStyle}
            onClick={handleConsistClick} 
            startIcon={
              <Box sx={{ position: 'relative' }}>
                <TrainIcon sx={{...iconStyle, ...{ position: 'relative', left: '-5px', top: '-5px'}}} />
                <TrainIcon sx={{...iconStyle, ...{ position: 'absolute', left: '5px', top: '5px', color: '#00FF00' }}} />
              </Box>
            }>
            <Box sx={buttonLabelStyle}>
              Consist
            </Box>
          </Button>
        </Tooltip>
        <Tooltip title="Park">
          <Button 
            sx={buttonStyle}
            className="park"
            onClick={handleParkClick}
            startIcon={<LocalParkingIcon sx={iconStyle} size="large" />}>
            <Box sx={buttonLabelStyle}>
              Park
            </Box>
          </Button>
        </Tooltip>
      </ButtonGroup>

      <PrecisionDialog open={showPrecision} onClose={() => setShowPrecision(false)} setPrecision={setPrecision} loco={loco} />

    </Box>
  );
};

export default AdvancedControls;
