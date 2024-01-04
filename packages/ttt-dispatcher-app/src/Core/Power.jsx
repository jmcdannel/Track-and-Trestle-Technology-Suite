import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useMqtt } from '../Core/Com/MqttProvider'

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useDccStore } from '../Store/useDccStore';

export const Power = props => {

  const track = 'MAIN';
  const { dcc } = useMqtt();
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const powerStatus = useDccStore(state => state.powerStatus);
  const setPowerStatus = useDccStore(state => state.setPowerStatus);
  // const [ powerStatus, setPowerStatus ] = useState(undefined);
  const connected = dccDeviceStatus === CONNECTION_STATUS.CONNECTED;


  useEffect(async () => {
    function sendPower() {
      dcc({
        action: 'power',
        payload: `${powerStatus ? 1 : 0} ${track}`
      })
    }
    if (typeof powerStatus !== 'undefined') {
      sendPower();
    }
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