import React, { useEffect, useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TrainIcon from '@mui/icons-material/Train';
import LinearProgress from '@mui/material/LinearProgress';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Button from '@mui/material/Button';
import { Context } from '../Store/Store';
import jmriApi from '../Shared/jmri/jmriApi';

import './MiniThrottle.scss';


export const AvailableThrottle = props => {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ , dispatch ] = useContext(Context);
  
  const { 
    onLocoClick, 
    loco, 
    throttleIdx, 
    disabled, 
    loco: {  address, name } 
  } = props;

  const handleLocoClick = async () => {
    loco.throttleIdx = throttleIdx;
    try {
      if (isLoading) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, throttleIdx } });
      await jmriApi.requestLoco(address);
      setIsLoading(false);
      if (onLocoClick) {
        await onLocoClick(loco);
      }
    } catch (err) {
      console.error(err);
    }
    
  }

  useEffect(() => {
    jmriApi.on('acquire', 'Throttles',  async (address) => {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: true, lastAcquired: new Date() } });
    });
  }, [dispatch]);

  return (
    <Paper 
      display="flex"
      sx={{
        justifyContent: 'space-between',
        flexWrap: "wrap",
        position: 'relative'
      }}
      elevation={3} 
      className="available-throttle">
        <Avatar variant="square">{address}</Avatar>
        <Button
          variant="contained" 
          size="medium"
          color="secondary"
          disabled={disabled}
          startIcon={<TrainIcon />}
          endIcon={<OpenInBrowserIcon />}
          onClick={handleLocoClick}>
            <Box sx={{ minWidth: '10rem' }}>{name}</Box>
        </Button>
        <Box sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0 
        }}>
          {isLoading && <LinearProgress />}
        </Box>
      </Paper>
  )

}

export default AvailableThrottle;
