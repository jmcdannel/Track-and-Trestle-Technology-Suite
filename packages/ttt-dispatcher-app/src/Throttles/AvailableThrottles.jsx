
import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import AvailableThrottle from './AvailableThrottle';
import { Context } from '../Store/Store';

const AvailableThrottles = ({ onLocoSelected }) => {
  const [state] = useContext(Context);
  const { locos } = state;

  return <Box sx={{
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  }}>{
    locos
      ?.filter(loco => !loco.isAcquired)
      .map(loco => (
        <Box key={loco.address}>
          <AvailableThrottle loco={loco} disabled={false} onLocoClick={onLocoSelected} />
        </Box>
      ))
    }</Box>;
};

export default AvailableThrottles;
