import React, { useEffect, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TrainIcon from '@mui/icons-material/Train';
import Badge from '@mui/material/Badge';
import { Context } from '../Store/Store';
import { useLayoutRoadnames } from '../Shared/Hooks/useLayoutRoadnames';
import { useThrottleStore } from '../Store/useThrottleStore';

import './AvailableThrottle.scss';

const limitString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength);
  }
};

export const AvailableThrottle = props => {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ , dispatch ] = useContext(Context);
  
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
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true, lastAcquired: new Date() } });
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
          <Badge 
              badgeContent={1 + (consist?.length || 0)} 
              color="info"
              className="throttle__consist-badge"
              invisible={!consist?.length}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}>
             <Chip className="throttle-nameplate" label={limitString(name, 4)} size="small" variant="outlined"></Chip>
            </Badge>
           <Box className="throttle-logo">
            {roadlogo ? roadlogo : <TrainIcon />}
          </Box>
      </Box>
    </Box>
  )


}

export default AvailableThrottle;
