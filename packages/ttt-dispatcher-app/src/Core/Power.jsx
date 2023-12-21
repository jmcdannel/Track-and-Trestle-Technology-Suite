import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import dccApi from '../Shared/api/dccApi';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Power = props => {

  const [ powerStatus, setPowerStatus ] = useState(false);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const connected = dccDeviceStatus === CONNECTION_STATUS.CONNECTED;


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
      disabled={!connected}
    >
      <PowerSettingsNewIcon />
    </IconButton>)
}

export default Power;