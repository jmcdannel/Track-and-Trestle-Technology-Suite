import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const powerStates = {
  unknown: 0, 
  on: 2, 
  off: 4
};

export const Power = props => {

  const { jmriApi, jmriReady } = props;

  const [ powerStatus, setPowerStatus ] = useState(powerStates.unknown);
  const [ initialized, setInitialized ] = useState(false);


  useEffect(() => {
    const handlePowerStateChange = state => {
      setPowerStatus(state);
    }

    if (jmriReady && !initialized) {
      jmriApi.on('power', 'Power', handlePowerStateChange);
      jmriApi.power();
      setInitialized(true);
    }
  }, [ initialized, jmriReady, jmriApi, setPowerStatus ]);

  const handlePowerClick = () => {
    if (powerStatus === powerStates.unknown || powerStatus === powerStates.off) {
      jmriApi.power(powerStates.on);
    } else if (powerStatus === powerStates.on) {
      jmriApi.power(powerStates.off);
    }
  }

  const getCurrentStateKey = () => {
    const currState = Object.keys(powerStates)
      .filter(key => powerStates[key] === powerStatus);
    return currState.length ? currState[0] : 'unknown';
  }

  const getClassName = () => jmriApi.getState().ready && initialized
      ? `header-button power-${getCurrentStateKey()}`
      : 'header-button power-pending';

  return (
    <IconButton
      onClick={handlePowerClick} 
      className={getClassName()}
      color="inherit"
      variant="outlined"
    >
      <PowerSettingsNewIcon />
    </IconButton>)
}

export default Power;