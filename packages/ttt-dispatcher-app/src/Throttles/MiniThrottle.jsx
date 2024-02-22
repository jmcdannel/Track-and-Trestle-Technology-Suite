import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import SpeedControl from './SpeedControl';
import Functions from './Functions';
import ThrottleSettings from './ThrottleSettings';
import ThrottleActions from './ThrottleActions';
import LocoName from './LocoName';
import LocoAvatar from './LocoAvatar';
import AdvancedControls from './AdvancedControls';
import { ThrottleConsist } from './ThrottleConsist';
// import JmriThrottleController from './JmriThrottleController';
import DccExThrottleController from './DccExThrottleController';
import useDebounce from '../Shared/Hooks/useDebounce';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useMqtt } from '../Core/Com/MqttProvider'
import { roadClassName, formattedAddress, WAY_UP_STEP } from './throttleUtils';

import './MiniThrottle.scss';

export const MiniThrottle = props => {

	const STOP = '0.0';

  const { 
    loco, 
    disabled, 
    onLocoClick, 
    loco: { 
      cruiseDisabled, 
      isAcquired, 
      consist,
      maxSpeed = 100,
      forward
    } 
  } = props;

  const address = Number(props.loco.address);
  const { dcc } = useMqtt();
  const throttle = useThrottleStore(state => state.getThrottle)(address);
  const speed = throttle?.speed || 0;

  const calcSpeed = useCallback(origSpeed => origSpeed * (forward === true ? 1 : -1), [forward]);

  const [ showFunctionsDrawer, setShowFunctionsDrawer ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showConsist, setShowConsist] = useState(false);
  const [ functionState, setFunctionState ] = useState([]);
  const [ uiSpeed, setUiSpeed ] = useState(calcSpeed(speed));
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

  const handleFunctionClick = async clickedIndex => {
    let newFunctionState = [...functionState];
    const newState = newFunctionState[clickedIndex]
      ? { on: !newFunctionState[clickedIndex].on }
      : { on: true };
    newFunctionState[clickedIndex] = newState;
    setFunctionState(newFunctionState)
    dcc('function', {
        address,
        state: newState.on,
        func: clickedIndex
      });
  }

  // useEffect(() => {
  //   jmriApi.on('acquire', 'Throttles', async address => {
  //     await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true, lastAcquired: new Date() } });
  //   });
  // }, [jmriApi, dispatch]);

  // const computedClassName = () => {
  //   return ['mini-throttle', 
  //     `mini-throttle--${loco.name.replace(' ', '')}  mini-throttle--${loco.meta?.roadname?.replace(' ', '')}`,
  //     isAcquired ? 'mini-throttle__acquired' : 'mini-throttle__notacquired'].join(' ');
  // }

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
        <ThrottleConsist address={address} consist={loco.consist} onChange={() => { /* no op */ }} />
      </Dialog>

      <Paper className="mini-throttle">
        <LocoAvatar loco={loco} />
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
      </>
  )

}

export default MiniThrottle;
