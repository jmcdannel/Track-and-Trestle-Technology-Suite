import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import mqtt from "mqtt";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import dccApi from '../Shared/api/dccApi';

import { Context }  from '../Store/Store';

import Connections from '../Connections/Connections';

export const Settings = () => {
  const [ state, dispatch ] = useContext(Context);
  let client = mqtt.connect('mqtt://joshs-mac-mini.local', 
    { port: 5005 }); // create a client
  client.on('connect', function () {
    console.log('mqtt onnected')
    // Subscribe to a topic
    client.subscribe('test', function (err) {
      if (!err) {
        // Publish a message to a topic
        client.publish('test', 'Hello mqtt')
      }
    })
  })
  const handleServoClick = async (angle) => {
    const action = {
      servo: 0,
      angle
    }
    client.publish('ttt', JSON.stringify(action));
  }

  return (
     <Box sx={{
      alignContent: 'flex-start',
      overflow:'auto',
      flex: '1'
    }}>
      <Link to="/dcc">DCC Log</Link>
      <Connections />
        <Paper>
          <h2>dccApi</h2>
          <pre>{dccApi.isConnected.toString()}</pre>
          <pre>{dccApi.getConnectionId()}</pre>
          Settings
          <Button onClick={() => handleServoClick(50)}>50</Button>
          <Button onClick={() => handleServoClick(150)}>150</Button>

        </Paper>        
      </Box>
  );
}

export default Settings;
