import React from 'react';
import Box from '@mui/material/Box';
import { DccCommand } from './DccCommand';
import { DccLog } from './DccLog';
import { useDccStore } from '../Store/useDccStore';
import { useThrottleStore } from '../Store/useThrottleStore';

export const Dashboard = () => {
  const log = useDccStore(state => state.log);
  const throttles = useThrottleStore(state => state.throttles);
 
  return (
    <Box sx={{
     alignContent: 'flex-start',
     overflow:'auto',
     flex: '1',
     textAlign: 'left',
   }}>
      <DccCommand />
      <Box>
        <pre>
          {JSON.stringify(throttles, null, 2)}
        </pre>
      </Box>
      <DccLog />
    </Box>
  );
};

export default Dashboard;
