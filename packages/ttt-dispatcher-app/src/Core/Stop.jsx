import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import PanToolIcon from '@mui/icons-material/PanTool';
import { useMqtt } from '../Core/Com/MqttProvider'

const STOP = '!';

export const Stop = () => {

  const { publish } = useMqtt();

  const handleStopClick = async () => {

    try {
      console.log('handleStopClick');
      publish('ttt-dcc',  JSON.stringify({
        action: 'dcc',
        payload: STOP
      }))
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