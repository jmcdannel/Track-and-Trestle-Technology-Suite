import React, { useEffect, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TrainIcon from '@mui/icons-material/Train';

import NamePlate from '../Shared/components/NamePlate';
import { useLayoutRoadnames } from '../Shared/Hooks/useLayoutRoadnames';
import { useThrottleStore } from '../Store/useThrottleStore';
import { useLocoStore } from '../Store/useLocoStore';

import './AvailableThrottle.scss';

export const AvailableThrottle = props => {

  const [ isLoading, setIsLoading ] = useState(false);
  const updateLoco = useLocoStore(state => state.updateLoco);
  
  const { 
    onLocoClick, 
    loco, 
    disabled, 
    loco: {  address, name }
  } = props;

  const throttle = useThrottleStore(state => state.getThrottle)(address);
  const [roadname, roadlogo] = useLayoutRoadnames(loco?.meta?.roadname);
  const consist = throttle?.consist || [];

  const handleLocoClick = async () => {
    try {
      if (isLoading) {
        setIsLoading(false);
        return;
      }
      updateLoco({ address, isAcquired: true, lastAcquired: new Date() });
      if (onLocoClick) {
        await onLocoClick(loco);
      }
    } catch (err) {
      console.error(err);
    }    
  }

  return (
    <Box className="available-throttle-wrapper">
      <Box 
        className={`available-throttle ${roadname?.toLowerCase()} ${throttle?.speed ? 'vibrate-1' : ''}`} 
        onClick={handleLocoClick}>

          <NamePlate name={name} consistCount={1 + (consist?.length || 0)} />
           <Box className="throttle-logo">
            {roadlogo ? roadlogo : <TrainIcon />}
          </Box>
      </Box>
    </Box>
  )


}

export default AvailableThrottle;
