import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import PanToolIcon from '@mui/icons-material/PanTool';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useDcc } from '../Dcc/useDcc'
import { useConnectionStore } from '../Store/useConnectionStore';
import { useLocoStore } from '../Store/useLocoStore';
import { useThrottleStore } from '../Store/useThrottleStore';

const STOP = '!';

export const Stop = () => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const locos = useLocoStore(state => state.locos);
  const updateLoco = useLocoStore(state => state.updateLoco);
  const clearThrottles = useThrottleStore(state => state.clearThrottles);
  const { publish } = useMqtt();
  const { setSpeed } = useDcc()

  const handleStopClick = async () => {

    try {
      console.log('handleStopClick');
      publish(`@ttt/dcc/${layoutId}`,  JSON.stringify({
        action: 'dcc',
        payload: STOP
      }))
      locos.forEach(loco => {
        setSpeed(loco.address, 0)
        updateLoco({ address: loco.address, speed: 0 })
      })
      clearThrottles()
    } catch (err) { console.error(err); }
   // TODO: set all locos to stopped, speed = 0
  }

  return (
    <IconButton
      onClick={handleStopClick} 
    >
      <PanToolIcon sx={{ fill: 'red' }} />
    </IconButton>)
}

export default Stop;