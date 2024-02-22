import React, { useContext } from 'react';
import Box from '@mui/material/Box';

import Connections from '../Connections/Connections';

export const Settings = () => {
  
  return (
     <Box sx={{
      alignContent: 'flex-start',
      overflow:'auto',
      flex: '1'
    }}>
      <Connections />
    </Box>
  );
}

export default Settings;
