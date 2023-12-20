import React, { useContext, useState}  from 'react';
import axios from  'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import MenuItem from '@mui/material/MenuItem';
import ExpandIcon from '@mui/icons-material/Expand';
import CompressIcon from '@mui/icons-material/Compress';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { ThrottleConsist } from './ThrottleConsist';
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

  const [showPrecision, setShowPrecision] = useState(false);
  const [showConsist, setShowConsist] = useState(false);

  const [ state, dispatch ] = useContext(Context);
  const { locos } = state;

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

  const handleAutoStopClick = async () => {
    try {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, autoStop: !loco.autoStop } });
    } catch (err) {
      console.error(err);
    }
  }

  const handlePrecisionClick = async () => {
    setShowPrecision(true)
  }

  const handleConsistClick = async () => {
    setShowConsist(true)
  }

  const handleParkClick = async () => {
    try {
      onStop();
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, speed: 0, cruiseControl: false } });
    } catch (err) {
      console.error(err);
    }    
  }

  const setPrecision = async (val) => {
    try {
      setShowPrecision(false)
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, maxSpeed: val } });
    } catch (err) {
      console.error(err);
    }
  }

  const setConsist = async (val) => {
    try {
      setShowConsist(false)
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, maxSpeed: val } });
    } catch (err) {
      console.error(err);
    }
  }

  const handleLed = async () => {
    console.log('handleLed', loco);
    const url = 'http://192.168.86.51:80/led';
    const data = {
      start: 0,
      end: 20,
      command: "color",
      r: 200,
      g: 0,
      b: 50
    };

    const result = await axios.post(url, data);

    console.log('result', result);

  }

  return (    
    <Box className="height100" sx={{ pb: '2rem' }} flex="1" alignItems="center" display="flex" justifyContent="flex-end" flexDirection="column" >
      <slot></slot>

      {/* <IconButton onClick={handleLed}>< TrainIcon /></IconButton> */}

      <ButtonGroup
        variant="text"
        size="large"
        className="rounded-button-group throttle__advanced-controls">
        <Tooltip title="Cruise Control">
          <Button 
            className="cruise-control"
            onClick={handleCruiceControlClick} 
            disabled={cruiseDisabled}
            startIcon={<SpeedIcon />}>
            Cruise Control
          </Button>
        </Tooltip>
        <Tooltip title="Auto Stop">
          <Button 
            onClick={handleAutoStopClick} 
            startIcon={loco.autoStop  ? <CompressIcon /> : <ExpandIcon/>}>
            Auto Stop
          </Button>
        </Tooltip>
        <Tooltip title="Precision">
          <Button 
            className="cruise-control"
            onClick={handlePrecisionClick} 
            startIcon={<ThermostatAutoIcon />}>
            Precision
          </Button>
        </Tooltip>
        <Tooltip title="Cruise Control">
          <Button 
            className="cruise-control"
            onClick={handleConsistClick} 
            startIcon={
              <Box sx={{ position: 'relative' }}>
                <TrainIcon sx={{ position: 'relative', left: '-5px', top: '-5px'}} />
                <TrainIcon sx={{ position: 'absolute', left: '5px', top: '5px', color: '#00FF00' }} />
                </Box>
              }>
            Consist
          </Button>
        </Tooltip>
        <Tooltip title="Park">
          <Button 
            className="park"
            onClick={handleParkClick}
            startIcon={<LocalParkingIcon sx={iconStyle} size="large" />}>
            Park
          </Button>
        </Tooltip>
      </ButtonGroup>
      <Dialog onClose={setPrecision} open={showPrecision}>
        <DialogTitle>Thorttle Precision</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => setPrecision(20)}>
              <ListItemText primary={20} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => setPrecision(50)}>
              <ListItemText primary={50} />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton onClick={() => setPrecision(100)}>
              <ListItemText primary={100} />
            </ListItemButton>
          </ListItem>
        </List>

      </Dialog>

      <Dialog onClose={setConsist} open={showConsist}>
        <DialogTitle>Consist</DialogTitle>
        <ThrottleConsist consist={loco.consist} locos={locos} onChange={setConsist} />
      </Dialog>
    </Box>
  );
};

export default AdvancedControls;
