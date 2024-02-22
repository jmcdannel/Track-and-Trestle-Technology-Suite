import React, { useEffect, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TrainIcon from '@mui/icons-material/Train';
import { Context } from '../Store/Store';
import { useLayoutRoadnames } from '../Shared/Hooks/useLayoutRoadnames';
import { useThrottleStore } from '../Store/useThrottleStore';

import './AvailableThrottle.scss';

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
    <Box 
      className={`available-throttle ${roadname?.toLowerCase()} ${throttle?.speed ? 'vibrate-1' : ''}`} 
      onClick={handleLocoClick}>
      <header>
        <Chip label={name} size="small" variant="outlined"></Chip>
        <Chip label={name} size="small" variant="outlined"></Chip>
      </header>
      <Box className="throttle-body">
        <Box className="throttle-body-window">
        {address}
        </Box>
        <Box className="throttle-body-window">
        {roadname}
        </Box>
      </Box>
      <Box className="throttle-hood">
        <hr />
      </Box>
      <Box className="throttle-logo">
        {roadlogo ? roadlogo : <TrainIcon />}
      </Box>
    </Box>
  )

        /* <Button
          sx={{
            justifyContent: 'space-between'
          }}
          variant="contained" 
          size="medium"
          color="secondary"
          disabled={disabled}
          fullWidth
          startIcon={<Avatar>{address}</Avatar>}
          endIcon={<TrainIcon />}
          onClick={handleLocoClick}>
            <LocoName loco={loco} />
            {throttle && <Chip label={throttle.speed}></Chip>}
        </Button> */

}

export default AvailableThrottle;
