import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import { Context } from '../Store/Store';
import MiniThrottle from '../Throttles//MiniThrottle';

export const CruiseThrottles = () => {

  const [ state ] = useContext(Context);
  const { locos } = state;
  const cruiseLocos = locos?.filter(loco => loco.cruiseControl);

  function renderCruiseThrottles() {
    return cruiseLocos?.length ? (
      <Box 
        flexGrow={0} 
        display="flex" 
        flexDirection="row" 
        flexWrap="wrap"
        >
          {cruiseLocos.map(loco => (
            <Box key={loco.address} flexBasis="33%">
              <MiniThrottle loco={loco} disabled={false} />
            </Box>
          ))}
      </Box> 
    ) : null;
  }

  return (
    <>
      {renderCruiseThrottles()}
    </>
  )
}

export default CruiseThrottles;
