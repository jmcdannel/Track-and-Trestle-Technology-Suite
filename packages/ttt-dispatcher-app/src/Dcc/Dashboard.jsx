import React from 'react';
import Box from '@mui/material/Box';
import { DccCommand } from './DccCommand';
import { DccLog } from './DccLog';

export const Dashboard = () => {
 
  return (
    <Box sx={{
     alignContent: 'flex-start',
     overflow:'auto',
     flex: '1',
     textAlign: 'left',
   }}>
      <DccCommand />
      <DccLog />
    </Box>
  );
};

export default Dashboard;
