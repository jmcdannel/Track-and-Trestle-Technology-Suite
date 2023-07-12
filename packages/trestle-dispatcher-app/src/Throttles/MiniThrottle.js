import React, { useState, useEffect, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TrainIcon from '@mui/icons-material/Train';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ThrottleSpeed from './ThrottleSpeed';
import JmriThrottleController from './JmriThrottleController';
import PanToolIcon from '@mui/icons-material/PanTool';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { Context } from '../Store/Store';
import useDebounce from '../Shared/Hooks/useDebounce';

import './MiniThrottle.scss';

export const MiniThrottle = props => {

  const [ , dispatch ] = useContext(Context);
  const maxSpeed = 100;
  const minSpeed = -maxSpeed;
	const STOP = '0.0';

  const { jmriApi, onLocoClick, loco, disabled, loco: { 
    address, 
    isAcquired, 
    speed, 
    forward
  } } = props;


  const initialUiSpeed = speed * 100 * (forward === true ? 1 : -1);

  const [ uiSpeed, setUiSpeed ] = useState(initialUiSpeed);
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

  const handleLocoClick = () => {
    if (onLocoClick) {
      onLocoClick(loco);
    }
  }

  const handleParkClick = async () => {
    try {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, cruiseControl: false } });
      await jmriApi.throttle(address, STOP);
      await jmriApi.releaseLoco(address);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    jmriApi.on('acquire', 'Throttles', async address => {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true, lastAcquired: new Date() } });
    });
  }, [jmriApi, dispatch]);

  const computedClassName = () => {
    return ['mini-throttle', 
      `mini-throttle--${loco.name.replace(' ', '')}  mini-throttle--${loco.road.replace(' ', '')}`,
      isAcquired ? 'mini-throttle__acquired' : 'mini-throttle__notacquired'].join(' ');
  }

  return (
    <Paper elevation={3} className={computedClassName()}>
        <Chip
            label={`${loco.address}`}
            icon={<TrainIcon />}
            className="chip"
            variant={isAcquired ? 'default' : 'outlined'}
            clickable
            disabled={disabled}
            onClick={handleLocoClick}
          />
          <JmriThrottleController speed={debouncedSpeed} address={address} jmriApi={jmriApi} forward={forward} />
          <ThrottleSpeed speed={debouncedSpeed} idleByDefault={loco.idleByDefault} />
          
          <ButtonGroup
                      orientation="horizontal"
                      className="throttle__controls__group"
                      aria-label="vertical outlined primary button group"
                    >
            <IconButton 
              className="speed-down-btn"
              size="lamediumrge" 
              disabled={speed === minSpeed} 
              onClick={handleDownClick}>
                <RemoveIcon />
            </IconButton>
            <IconButton 
              className="speed-stop-btn"
              size="medium" 
              disabled={!isAcquired} 
              color="primary" 
              onClick={handleStopClick} >
                <PanToolIcon />
              </IconButton>
            <IconButton 
              className="speed-up-btn"
              size="medium" 
              disabled={speed === maxSpeed} 
              onClick={handleUpClick}>
                <AddIcon />
            </IconButton>
          </ButtonGroup>

          <IconButton size="medium" onClick={handleParkClick} ><LocalParkingIcon /></IconButton>
                  
      </Paper>
  )

}

export default MiniThrottle;
