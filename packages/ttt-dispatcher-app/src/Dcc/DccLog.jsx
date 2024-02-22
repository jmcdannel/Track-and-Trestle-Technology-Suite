import React from 'react';
import Box from '@mui/material/Box';
import { useDccStore } from '../Store/useDccStore';

import './DccLog.scss';

export const DccLog = () => {
  const log = useDccStore(state => state.log);
 
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
      {log && log.map((item, idx) => 
        <pre key={`log${idx}`} className="slide-in-left">{item}</pre>
      )}
    </Box>
  );
};

export default DccLog;
