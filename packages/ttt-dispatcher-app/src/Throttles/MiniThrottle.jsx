import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import Typography from '@mui/material/Typography';
import TrainIcon from '@mui/icons-material/Train';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ThrottleSpeed from './ThrottleSpeed';
import ThrottleSlider from './ThrottleSlider';
import SpeedControl from './SpeedControl';
import Functions from './Functions';
import ThrottleSettings from './ThrottleSettings';
import ThrottleActions from './ThrottleActions';
import LocoName from './LocoName';
import AdvancedControls from './AdvancedControls';
// import JmriThrottleController from './JmriThrottleController';
import DccExThrottleController from './DccExThrottleController';
import PanToolIcon from '@mui/icons-material/PanTool';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import BnsfLogoSvg from '../Shared/Images/logos/bnsf.svg?react';
import { Context } from '../Store/Store';
import useDebounce from '../Shared/Hooks/useDebounce';
import { roadClassName, formattedAddress, WAY_UP_STEP } from './throttleUtils';

import './MiniThrottle.scss';

export const MiniThrottle = props => {

  const [ , dispatch ] = useContext(Context);
	const STOP = '0.0';

  const { onLocoClick, loco, disabled, loco: { 
    address, 
    cruiseDisabled, 
    isAcquired, 
    speed, 
    consist,
    maxSpeed = 100,
    forward
  } } = props;


  const initialUiSpeed = speed * (forward === true ? 1 : -1);

  const [ uiSpeed, setUiSpeed ] = useState(initialUiSpeed);
  const [ showSettings, setShowSettings ] = useState(false);
  const debouncedSpeed = useDebounce(uiSpeed, 100);

  const handleStopClick = () => {
    setUiSpeed(parseInt(STOP));
  }

  const handleUpClick = () => {
    setUiSpeed(uiSpeed + 1);
  }

  const handleDownClick = () => {
    setUiSpeed(uiSpeed - 1);
  }

  const handleWayUpClick = () => {
    setUiSpeed(uiSpeed + WAY_UP_STEP);
  }

  const handleWayDownClick = () => {
    setUiSpeed(uiSpeed - WAY_UP_STEP);
  }

  const handleLocoClick = async () => {
    await dispatch({ type: 'UPDATE_LOCO', payload: { address: loco.address, cruiseControl: false } }); 
    if (onLocoClick) {
      onLocoClick(loco);
    }
  }
  const handleParkClick = async () => {
    try {
      setUiSpeed(parseInt(STOP));
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, cruiseControl: false } });
    } catch (err) {
      console.error(err);
    }
  }

  // useEffect(() => {
  //   jmriApi.on('acquire', 'Throttles', async address => {
  //     await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true, lastAcquired: new Date() } });
  //   });
  // }, [jmriApi, dispatch]);

  const computedClassName = () => {
    return ['mini-throttle', 
      `mini-throttle--${loco.name.replace(' ', '')}  mini-throttle--${loco.meta?.roadname?.replace(' ', '')}`,
      isAcquired ? 'mini-throttle__acquired' : 'mini-throttle__notacquired'].join(' ');
  }

  return (
    <>
      <DccExThrottleController 
        speed={debouncedSpeed} 
        address={address} 
        forward={(debouncedSpeed >= 0)} 
        consist={consist}
      />
      <Paper className="mini-throttle">
        <Avatar sx={{ width: '4rem', height: '4rem' }} onClick={handleLocoClick} variant="square">{formattedAddress(loco)}</Avatar>
        <LocoName loco={loco} />
        <SpeedControl
          orientation="horizontal"
          uiSpeed={uiSpeed}
          maxSpeed={maxSpeed}
          minSpeed={-maxSpeed}
          handleWayUpClick={handleWayUpClick}
          handleUpClick={handleUpClick}
          handleStopClick={handleStopClick}
          handleDownClick={handleDownClick}
          handleWayDownClick={handleWayDownClick}
        />
        <Box sx={{ alignSelf: 'center' }}>
          <ThrottleActions
            cruiseDisabled={cruiseDisabled}
            loco={loco}
            onStop={handleStopClick}
            size="small"
            onShowSettings={() => setShowSettings(true)}
            onShowFunctionsDrawer={() => setShowFunctionsDrawer(true)}
          />
        </Box>
      </Paper>
      <ThrottleSettings
        loco={loco}
        maxSpeed={maxSpeed}
        show={showSettings}
        onHide={() => setShowSettings(false)} />
      
      </>
  )

}

export default MiniThrottle;
