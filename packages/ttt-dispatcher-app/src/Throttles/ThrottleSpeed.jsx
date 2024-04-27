import React from 'react';
import Box from '@mui/material/Box';

import { useDccStore } from '../Store/useDccStore';

import './ThrottleSpeed.scss';

export const ThrottleSpeed = props => {

  const powerStatus = useDccStore(state => state.powerStatus);
  const { speed, isDisabled = false } = props;

  const getCurrentStateKey = () => {
    if (typeof powerStatus === 'undefined') {
      return 'unknown';
    } else if (powerStatus === true) {
      return 'on';
    } else if (powerStatus === false) {
      return 'off';
    } else {
      return 'unknown';
    }
  }

  const computedClassName = () => {
    return `throttle__speed 
    ${isDisabled || powerStatus !== true ? 'throttle__speed--disabled' : ''}
    ${speed < 0 
      ? 'throttle__speed--reverse' 
      : 'throttle__speed--forward'}`;
  }

  return (
    <Box className={computedClassName()} sx={{
      minWidth: {
        xs: '3rem',
        md: '4rem',
        xl: '6rem'
      }
    }}>
      <Box component="span" sx={{ 
        fontSize: {
          xs: '1rem',
          lg: '1.5rem',
          xl: '3rem'
        },
        padding: {
          xs: '0',
          md: '1.5rem .5rem',
          lg: '1.5rem 1rem'
        }
      }}>
        {Math.abs(parseInt(speed))}
      </Box>
    </Box>
  );

}

export default ThrottleSpeed;