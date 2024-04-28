import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';

import AdvancedControls from './AdvancedControls';
import DccExThrottleController from './DccExThrottleController';
import Functions from './Functions';
import LocoName from './LocoName';
import NamePlate from '../Shared/components/NamePlate';
import SpeedControl from './SpeedControl';
import ThrottleActions from './ThrottleActions';
import ThrottleConsist from './ThrottleConsist';
import ThrottleSettings from './ThrottleSettings';
import ThrottleSlider from './ThrottleSlider';

import useDebounce from '../Shared/Hooks/useDebounce';
import { useBreakpoints } from '../Shared/Hooks/useBreakpoints';
import { roadClassName, formattedAddress, WAY_UP_STEP } from './throttleUtils';
import { useDcc } from '../Dcc/useDcc';
import { useLocoStore } from '../Store/useLocoStore';
import { useThrottleStore } from '../Store/useThrottleStore';

import './Throttle.scss';

export const Throttle = props => {

	const STOP = '0.0';
  const { 
    loco, 
    cruiseDisabled,
    variant = 'full',
    onLocoClick, 
    loco: {
      autoStop,
      maxSpeed = 100
    } 
  } = props;

  const address = Number(props.loco.address);
  const throttle = useThrottleStore(state => state.getThrottle)(address);
  const updateLoco = useLocoStore(state => state.updateLoco);
  const speed = throttle?.speed || 0;
  const consist = throttle?.consist || [];

  // const calcSpeed = origSpeed => origSpeed * (forward === true ? 1 : -1);

  const [ showFunctionsDrawer, setShowFunctionsDrawer ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showConsist, setShowConsist] = useState(false);
  const [ functionState, setFunctionState ] = useState([]);
  const [ uiSpeed, setUiSpeed ] = useState(speed);
  const debouncedSpeed = useDebounce(uiSpeed, 100);

  const { setFunction } = useDcc();

  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();

  const isVariantFull = variant === 'full';
  const isVariantHalf = variant === 'half';

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

  const handleLocoClick = async () => {
    await updateLoco({ address: loco.address, cruiseControl: !loco.cruiseControl }); 
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
    setFunction(address, clickedIndex, newState.on);
  }

  useEffect(() => {

    if (speed === 0) {
      setUiSpeed(0);
    }

  }, [speed])

  function renderThrottle() {
    return (
      <Box className="throttle-wrapper" sx={{ padding: '.5rem', display: 'flex', flex: '1' }}>
        <Card
          className={`throttle ${variant}throttle throttle--${loco.name?.replace(' ', '')}  throttle--${loco?.meta?.roadname.replace(' ', '')} disable-dbl-tap-zoom`} >
          <CardHeader
            title={null}
            avatar={
              <NamePlate 
                name={loco.name} 
                size="small" 
                consistCount={1 + (consist?.length || 0)} 
                onClick={handleLocoClick}
              />
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
          {/* {down.lg && (
            <CardHeader title={<LocoName loco={loco} />}></CardHeader>
          )} */}
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
              
                <Grid item 
                  xs={5} sm={4} md={4} 
                  display="flex" 
                  className="throttle__actions">
                  <AdvancedControls
                    cruiseDisabled={cruiseDisabled}
                    loco={loco}
                    onStop={handleStopClick}
                    onShowSettings={() => setShowSettings(true)}
                    onShowConsist={() => setShowConsist(true)}
                    onShowFunctions={() => setShowFunctionsDrawer(true)}
                  />
                </Grid>
              {isVariantFull && (
              // {up.md && isVariantFull && (
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
              )}
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
      </Box>
    )
  }

  function renderMiniThrottle() {
    return (
      <Box sx={{ padding: '.5rem', flexBasis: '100%' }}>    
        <Paper className="mini-throttle">
          <NamePlate 
            size="small" 
            name={loco.name} 
            onClick={handleLocoClick}
            consistCount={1 + (consist?.length || 0)} 
          />
          {/* <LocoName loco={loco} /> */}
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
          <Box sx={{ 
            alignSelf: 'center',
            display: {
              xs: 'none',
              sm: 'block'
            }
          }}>
            <ThrottleActions
              cruiseDisabled={cruiseDisabled}
              loco={loco}
              onStop={handleStopClick}
              size="small"
              onShowSettings={() => setShowSettings(true)}
              onShowConsist={() => setShowConsist(true)}
              onShowFunctionsDrawer={() => setShowFunctionsDrawer(true)}
            />
          </Box>
        </Paper>
      </Box>
    )
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

      <Dialog 
        fullScreen
        onClose={() => setShowConsist(false)} open={showConsist}>
        <ThrottleConsist
          loco={loco}
          consist={consist}
          onClose={() => setShowConsist(false)}
          onChange={() => { setShowConsist(false) }}
        />
      </Dialog>
      {variant === 'cruise' ? renderMiniThrottle() : renderThrottle()}
    </>
  )
}

export default Throttle;
