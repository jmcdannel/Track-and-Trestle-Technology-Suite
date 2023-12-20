import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Connections from '../Connections/Connections';

export const Settings = () => {
  return (
     <Box sx={{
      alignContent: 'flex-start',
      overflow:'auto',
      flex: '1'
    }}>
        <Paper>
          Settings
          <Connections />
        </Paper>        
      </Box>
  );
}

export default Settings;
