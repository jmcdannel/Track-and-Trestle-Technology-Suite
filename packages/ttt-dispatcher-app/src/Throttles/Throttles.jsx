import React, { useContext, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';

import Throttle from './Throttle';
import MiniThrottle from './MiniThrottle';
import AvailableThrottle from './AvailableThrottle';

import { useBreakpoints } from '../Shared/Hooks/useBreakpoints';

import { Context } from '../Store/Store';

export const Throttles = () => {

  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();
  const [ state ] = useContext(Context);
  const { locos } = state;
  console.log('up.md', up.md);
  console.log('down.lg', down.lg);

  const [ isDrawerOpen, setIsDrawerOpen ] = useState(false);

  const handleAddButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const hasThrottles = locos.some(loco => loco.isAcquired);
  const throttles = locos.filter(loco => loco.isAcquired && !loco.cruiseControl);
  const cruiseThrottles = locos?.filter(loco => loco.isAcquired && loco.cruiseControl);
  const availableThrottles = locos?.filter(loco => !loco.isAcquired);
  
  return (
    <>    
      <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="stretch">
        <Grid item xs={12}>
          <Box 
          flexGrow={0} 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap"
          >
            {cruiseThrottles.map(loco => (
              <Box key={loco.address} flexBasis="100%">
                <MiniThrottle loco={loco} />
              </Box>
            ))}
          </Box> 
        </Grid>
      </Grid>
      <Box sx={{ 
        position: 'relative', 
        'display': 'flex', 
        'flexWrap': 'wrap',
        'flex': '1',
        backgroundColor: 'rgb(55, 61, 72)',
      }}>
        {throttles && throttles.length 
          ? throttles.filter(loco => loco.isAcquired && !loco.cruiseControl)
              .map(loco => (
                <Throttle 
                  key={loco.address}
                  loco={loco}
                  variant={down.lg || throttles.length === 1 ? 'full' : 'half'}
                />))
          : availableThrottles.map(loco => (
            <AvailableThrottle key={loco.address} loco={loco} />
          ))
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
          {availableThrottles.map(loco => (
            <AvailableThrottle key={loco.address} loco={loco} onLocoClick={() => setIsDrawerOpen(false)} />
          ))}
        </Drawer>
      </Box>
    </>
  );
}

export default Throttles;