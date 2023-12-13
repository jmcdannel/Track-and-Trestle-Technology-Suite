import React, { useContext, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';

import Throttle from './Throttle';
import MiniThrottle from './MiniThrottle';
import AvailableThrottle from './AvailableThrottle';
import AvailableThrottles from './AvailableThrottles';

import { Context } from '../Store/Store';


const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

export const Throttles = props => {

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
  
  return (
    <Box sx={{ position: 'relative', height: '75vh', 'display': 'flex' }}>
      {hasThrottles 
        ? locos
            .filter(loco => loco.isAcquired && !loco.cruiseControl)
            .map(loco => <Throttle loco={currentLoco} />)
        : <AvailableThrottles />
      }

      {hasThrottles && (
        <Fab  
          color="primary" 
          aria-label="add" 
          onClick={handleAddButtonClick}
          sx={fabStyle}>
          <AddIcon />
        </Fab>
      )}

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <AvailableThrottles />
      </Drawer>
    </Box>
  );
}

export default Throttles;