import React, {  useState } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';

import Throttle from './Throttle';
import AvailableThrottle from './AvailableThrottle';

import { useBreakpoints } from '../Shared/Hooks/useBreakpoints';
import { useLocoStore } from '../Store/useLocoStore';

export const Throttles = () => {

  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();
  const locos = useLocoStore(state => state.locos);

  const [ isDrawerOpen, setIsDrawerOpen ] = useState(false);

  const handleAddButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const hasThrottles = locos.some(loco => loco.isAcquired && !loco.cruiseControl);
  const acquiredThrottles = locos.filter(loco => loco.isAcquired && !loco.cruiseControl)
  const cruiseThrottles = locos.filter(loco => loco.isAcquired && loco.cruiseControl)
  const availableThrottles = locos?.filter(loco => !loco.isAcquired);

  const calculatedVariant = (loco) => {
    if (up.md && acquiredThrottles.length === 1) {
      return 'full';
    } else {
      return 'half';
    }
  }

  console.log('acquiredThrottles', acquiredThrottles);

  return (
    <>          
      <Box 
        className={`throttles-wrapper throttles-count-${acquiredThrottles.length} throttles-size-${getCurrentSize()}`}
      >
        {cruiseThrottles?.map(loco => (
          <Throttle 
            key={loco.address}
            loco={loco}
            variant="cruise"
          />))          
        }
        {acquiredThrottles?.map(loco => (
          <Throttle 
            key={loco.address}
            loco={loco}
            variant={calculatedVariant(loco)}
          />))          
        }

        {!acquiredThrottles?.length && availableThrottles?.map(loco => (
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
          <Box className="available-throttle-menu-list" sx={{ 
            width: '25vw', 
            minWidth: '20rem',
            padding: 2, 
            display: 'flex', 
            flexWrap: 'wrap',
            flex: '1',
            'alignItems': 'flex-end',
            'alignContent': 'flex-end'
            }}>
            {availableThrottles.map(loco => (
              <AvailableThrottle key={loco.address} loco={loco} onLocoClick={() => setIsDrawerOpen(false)} />
            ))}
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

export default Throttles;