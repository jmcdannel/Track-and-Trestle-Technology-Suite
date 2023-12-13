import React, { useState, useContext, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import DccExThrottleController from './DccExThrottleController';
import ThrottleSlider from './ThrottleSlider';
import SpeedControl from './SpeedControl';
import Functions from './Functions';
import ThrottleSettings from './ThrottleSettings';
import ThrottleActions from './ThrottleActions';

import useDebounce from '../Shared/Hooks/useDebounce';
import { roadClassName, formattedAddress } from './throttleUtils';
import dccApi from '../Shared/api/dccApi';

import './Throttle.scss';

export const Throttle = props => {

  // const EMERGENCY_STOP = '-1.0';
	const STOP = '0.0';
  // const FULL_SPEED = '1.0';
  const WAY_UP_STEP = 5;

  const { loco, cruiseDisabled, onLocoClick, loco: {
    speed,
    autoStop,
    forward,
    consist,
    maxSpeed = 100
  } } = props;
  const address = Number(props.loco.address);

  const calcSpeed = useCallback(origSpeed => origSpeed * 100 * (forward === true ? 1 : -1), [forward]);

  const [ showFunctions, setShowFunctions ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);
  const [ functionState, setFunctionState ] = useState([]);
  const [ uiSpeed, setUiSpeed ] = useState(calcSpeed(speed));

  const debouncedSpeed = useDebounce(uiSpeed, 100);

  const handleSliderSpeed = value => {
    setUiSpeed(value);
  }

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

  const handleLocoClick = () => {
    if (onLocoClick) {
      onLocoClick(loco);
    }
  }

  const handleFunctionClick = async clickedIndex => {
    let newFunctionState = [...functionState];
    const newState = newFunctionState[clickedIndex]
      ? { on: !newFunctionState[clickedIndex].on }
      : { on: true };
    newFunctionState[clickedIndex] = newState;
    setFunctionState(newFunctionState)
    dccApi.send('function', {
        address,
        state: newState.on,
        func: clickedIndex
      });
  }

  return (
    <>
      <DccExThrottleController
        speed={debouncedSpeed}
        address={address}
        forward={(debouncedSpeed >= 0)}
        consist={consist}
      />

      <Functions
        onFunctionClick={handleFunctionClick}
        show={showFunctions}
        onHide={() => setShowFunctions(false)} />

      <ThrottleSettings
        loco={loco}
        maxSpeed={maxSpeed}
        show={showSettings}
        onHide={() => setShowSettings(false)} />

      <Card
        className={`throttle throttle--${loco.name.replace(' ', '')}  throttle--${loco.road.replace(' ', '')}`} >
        <CardHeader
          title={consist ? `${loco.name} + ${consist.join(', ')}` : loco.name}
          avatar={
            <Avatar onClick={handleLocoClick} variant="square">{formattedAddress(loco)}</Avatar>
          } 
        />
        <CardContent className="throttle__content grow flex">
          <Grid container spacing={1} className="grow">
            <Grid sx={{display: { xs: 'none', sm: 'flex' }}} item xs={4} sm={4} md={4} flexGrow={1} display="flex" className="throttle__slider">
                <ThrottleSlider
                  max={maxSpeed}
                  className="throttle__slider__control"
                  speed={uiSpeed}
                  autoStop={autoStop}
                  onChange={handleSliderSpeed}
                />
            </Grid>
            <Grid item xs={5} sm={4} md={4} display="flex" className="throttle__actions">
              <ThrottleActions
                cruiseDisabled={cruiseDisabled}
                loco={loco}
                onStop={handleStopClick}
                onShowSettings={() => setShowSettings(true)}
                onShowFunctions={() => setShowFunctions(true)}
              />
            </Grid>
            <Grid item xs={7} sm={4} md={4} display="flex" className="throttle__controls">
              <SpeedControl
                uiSpeed={uiSpeed}
                maxSpeed={maxSpeed}
                minSpeed={-maxSpeed}
                handleUpClick={handleUpClick}
                handleStopClick={handleStopClick}
                handleDownClick={handleDownClick}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Throttle;
