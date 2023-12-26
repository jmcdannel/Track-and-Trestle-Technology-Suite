import React, { useState, useContext, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import useMediaQuery from '@mui/material/useMediaQuery';

import DccExThrottleController from './DccExThrottleController';
import ThrottleSlider from './ThrottleSlider';
import SpeedControl from './SpeedControl';
import Functions from './Functions';
import LocoName from './LocoName';
import ThrottleSettings from './ThrottleSettings';
import ThrottleActions from './ThrottleActions';
import AdvancedControls from './AdvancedControls';
import { ThrottleConsist } from './ThrottleConsist';

import useDebounce from '../Shared/Hooks/useDebounce';
import { useBreakpoints } from '../Shared/hooks/useBreakpoints';
import { roadClassName, formattedAddress, WAY_UP_STEP } from './throttleUtils';
import dccApi from '../Shared/api/dccApi';

import BnsfLogoSvg from '../Shared/images/logos/bnsf.svg?react';

import './Throttle.scss';

export const Throttle = props => {

  // const EMERGENCY_STOP = '-1.0';
	const STOP = '0.0';
  // const FULL_SPEED = '1.0';
  const WAY_UP_STEP = 5;

  const { 
    loco, 
    cruiseDisabled, 
    showAdvancedControls = false,
    showFunctions = false,
    className = '',
    onLocoClick, loco: {
      speed,
      autoStop,
      forward,
      consist,
      maxSpeed = 100
    } 
  } = props;
  const address = Number(props.loco.address);

  const calcSpeed = useCallback(origSpeed => origSpeed * (forward === true ? 1 : -1), [forward]);

  const [ showFunctionsDrawer, setShowFunctionsDrawer ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showConsist, setShowConsist] = useState(false);
  const [ functionState, setFunctionState ] = useState([]);
  const [ uiSpeed, setUiSpeed ] = useState(calcSpeed(speed));

  const debouncedSpeed = useDebounce(uiSpeed, 100);

  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();

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

      <ThrottleSettings
        loco={loco}
        maxSpeed={maxSpeed}
        show={showSettings}
        onHide={() => setShowSettings(false)} />

      <Dialog
        anchor={'right'}
        open={showFunctionsDrawer}
        onClose={() => setShowFunctionsDrawer(false)}
        >
        <DialogTitle>Functions</DialogTitle>
        <Functions onFunctionClick={handleFunctionClick} functionMap={loco.functions} />
      </Dialog>

      <Dialog onClose={() => setShowConsist(false)} open={showConsist}>
        <DialogTitle>Consist</DialogTitle>
        <ThrottleConsist consist={loco.consist} onChange={() => { /* no op */ }} />
      </Dialog>

      <Card
        className={`${className} throttle throttle--${loco.name?.replace(' ', '')}  throttle--${loco?.meta?.roadname.replace(' ', '')} disable-dbl-tap-zoom`} >
        <CardHeader
          title={up.lg ? <LocoName loco={loco} /> : null}
          avatar={
            <Avatar sx={{ width: '4rem', height: '4rem' }} onClick={handleLocoClick} variant="square">{formattedAddress(loco)}</Avatar>
          } 
          action={
            <ThrottleActions
              cruiseDisabled={cruiseDisabled}
              loco={loco}
              onStop={handleStopClick}
              size="small"
              onShowSettings={() => setShowSettings(true)}
              onShowConsist={() => setShowConsist(true)}
              onShowFunctions={() => setShowFunctionsDrawer(true)}
            />
          }
        />
        {down.lg && (
          <CardHeader title={<LocoName loco={loco} />}></CardHeader>
        )}
        <CardContent className="throttle__content grow flex">
          <Grid container spacing={1} className="grow">
            {/* {up.lg && showFunctions && (
              <Grid item 
                xs={5} sm={2} md={3} lg={3} 
                display="flex" 
                className="throttle__actions">
                <Functions onFunctionClick={handleFunctionClick} functionMap={loco.functions} />
              </Grid>
            )} */}
            {up.md && showAdvancedControls && (
              <Grid item 
                xs={5} sm={4} md={4} 
                display="flex" 
                className="throttle__actions">
                <AdvancedControls
                  cruiseDisabled={cruiseDisabled}
                  loco={loco}
                  onStop={handleStopClick}
                  onFunctionClick={handleFunctionClick}
                  onShowSettings={() => setShowSettings(true)}
                  onShowFunctions={() => setShowFunctions(true)}
                />
              </Grid>
            )}
            <Grid item
              xs={4} sm={4} md={3} 
              sx={{display: { xs: 'none', sm: 'flex' }}} 
              flexGrow={1} 
              className="throttle__slider">
                <ThrottleSlider
                  max={maxSpeed}
                  className="throttle__slider__control"
                  speed={uiSpeed}
                  autoStop={autoStop}
                  onChange={handleSliderSpeed}
                />
            </Grid>
            <Grid item 
              xs 
              sx={{ flex: 1 }} 
              className="throttle__controls">
              <SpeedControl
                uiSpeed={uiSpeed}
                maxSpeed={maxSpeed}
                minSpeed={-maxSpeed}
                handleWayUpClick={handleWayUpClick}
                handleUpClick={handleUpClick}
                handleStopClick={handleStopClick}
                handleDownClick={handleDownClick}
                handleWayDownClick={handleWayDownClick}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default Throttle;
