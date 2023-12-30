import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import dccApi from '../Shared/api/dccApi';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useDccStore } from '../Store/useDccStore';

export const Power = props => {

  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const powerStatus = useDccStore(state => state.powerStatus);
  const setPowerStatus = useDccStore(state => state.setPowerStatus);
  // const [ powerStatus, setPowerStatus ] = useState(undefined);
  const connected = dccDeviceStatus === CONNECTION_STATUS.CONNECTED;


  useEffect(async () => {
      await dccApi.setPower(powerStatus);
  }, [ powerStatus ]);

  const handlePowerClick = async () => {
    setPowerStatus(!powerStatus);
  }

  const getCurrentStateKey = () => {
    if (typeof powerStatus === 'undefined') {
      return 'unknown';
    } else if (powerStatus === true) {
      return 'on';
    } else if (powerStatus === false) {
      return 'off';
    } else {
      return 'unknown';
    }
  }

  const getClassName = () => `header-button power-${getCurrentStateKey()}`;

  return (
    <IconButton
      onClick={handlePowerClick} 
      disabled={!connected}
      className={getClassName()}
    >
      <PowerSettingsNewIcon />
    </IconButton>)
}

export default Power;