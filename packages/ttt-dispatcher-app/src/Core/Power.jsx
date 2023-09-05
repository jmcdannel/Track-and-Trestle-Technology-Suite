import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import dccApi from '../Shared/dcc/dccApi';

export const Power = props => {

  const [ powerStatus, setPowerStatus ] = useState(false);
  const { isConnected } = dccApi;


  useEffect(async () => {
      await dccApi.setPower(powerStatus);
  }, [ powerStatus ]);

  const handlePowerClick = async () => {
    setPowerStatus(!powerStatus);
  }

  const getCurrentStateKey = () => powerStatus ? 'on' : 'off';

  const getClassName = () => `header-button power-${getCurrentStateKey()}`;

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