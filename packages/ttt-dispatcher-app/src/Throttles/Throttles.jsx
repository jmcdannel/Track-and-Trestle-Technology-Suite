import React, { useContext, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';

import Throttle from './Throttle';
import MiniThrottle from './MiniThrottle';
import AvailableThrottle from './AvailableThrottle';
import AvailableThrottles from './AvailableThrottles';


import { useBreakpoints } from '../Shared/hooks/useBreakpoints';
import { Context } from '../Store/Store';

export const Throttles = props => {

  const [ isXs, isSm, isMd, isLg, isXl, getCurrentSize ] = useBreakpoints();
  const [ state, dispatch ] = useContext(Context);
  const { locos } = state;

  const currentLoco = locos.find(loco => loco.isAcquired && !loco.cruiseControl);

  const [ isDrawerOpen, setIsDrawerOpen ] = useState(false);

  const handleAddButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const hasThrottles = locos.some(loco => loco.isAcquired);
  const throttleCount = locos
    .filter(loco => loco.isAcquired && !loco.cruiseControl)?.length;
  
    console.log('throttleCount', throttleCount, ((isLg || isXl ) && throttleCount === 1));
  return (
    <Box sx={{ 
      position: 'relative', 
      'display': 'flex', 
      'flexWrap': 'wrap',
      'flex': '1'
    }}>
      {hasThrottles 
        ? locos
            .filter(loco => loco.isAcquired && !loco.cruiseControl)
            .map(loco => (
              <Throttle 
                className={throttleCount === 1 ? 'fullthrottle' : 'halfthrottle'}
                key={loco.address}
                loco={loco}
                showAdvancedControls={throttleCount === 1}
                showFunctions={throttleCount === 1}
              />))
        : <AvailableThrottles />
      }

      {hasThrottles && (
        <Fab  
          color="primary" 
          aria-label="add" 
          onClick={handleAddButtonClick}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}>
          <AddIcon />
        </Fab>
      )}

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <AvailableThrottles onLocoSelected={() => setIsDrawerOpen(false)} />
      </Drawer>
    </Box>
  );
}

export default Throttles;