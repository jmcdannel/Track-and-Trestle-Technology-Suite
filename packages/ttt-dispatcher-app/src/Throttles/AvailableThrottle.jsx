import React, { useEffect, useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TrainIcon from '@mui/icons-material/Train';
import Button from '@mui/material/Button';
import { Context } from '../Store/Store';

export const AvailableThrottle = props => {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ , dispatch ] = useContext(Context);
  
  const { 
    onLocoClick, 
    loco, 
    disabled, 
    loco: {  address, name }
  } = props;

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
        <Button
          variant="contained" 
          size="medium"
          color="secondary"
          disabled={disabled}
          fullWidth
          startIcon={<Avatar variant="square">{address}</Avatar>}
          endIcon={<TrainIcon />}
          onClick={handleLocoClick}>
            {name}
        </Button>
  )

}

export default AvailableThrottle;
