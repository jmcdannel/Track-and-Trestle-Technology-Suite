import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import dccApi from '../Shared/api/dccApi';

import { Context }  from '../Store/Store';

import Connections from '../Connections/Connections';

export const Settings = () => {
  const [ state, dispatch ] = useContext(Context);
  const { dccLog } = state;
  return (
     <Box sx={{
      alignContent: 'flex-start',
      overflow:'auto',
      flex: '1'
    }}>
        <Paper>
          <h2>dccApi</h2>
          <pre>{dccApi.isConnected.toString()}</pre>
          <pre>{dccApi.getConnectionId()}</pre>
          <pre>{dccLog}</pre>
          Settings
          <Connections />


        </Paper>        
      </Box>
  );
}

export default Settings;
