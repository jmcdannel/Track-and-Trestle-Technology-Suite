import React from 'react';
import Box from '@mui/material/Box';
import { useDccStore } from '../Store/useDccStore';
import { useThrottleStore } from '../Store/useThrottleStore';

import './DccLog.scss';

const DccLog = () => {
  const log = useDccStore(state => state.log);
  const throttles = useThrottleStore(state => state.throttles);
 
  return (
    <Box sx={{
     alignContent: 'flex-start',
     overflow:'auto',
     flex: '1'
   }}>
      <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {/* <pre>dccLog: {dccLog}</pre> */}
        {log && log.map((item, idx) => 
          <pre key={`log${idx}`} className="slide-in-left">{item}</pre>
        )}
        {/* {throttles && throttles.map((item, idx) => 
          <pre key={`throttles${idx}`} className="slide-in-left">{JSON.stringify(item)}</pre>
        )} */}
      </Box>
    </Box>
  );
};

export default DccLog;
