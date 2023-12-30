import React from 'react';
import Box from '@mui/material/Box';

import './ThrottleSpeed.scss';

export const ThrottleSpeed = props => {

  const { speed, isDisabled = false } = props;

  const computedClassName = () => {
    return `throttle__speed 
    ${isDisabled ? 'throttle__speed--disabled' : ''}
    ${speed < 0 
      ? 'throttle__speed--reverse' 
      : 'throttle__speed--forward'}`;
  }

  return (
    <div className={computedClassName()}>
      <Box component="span" sx={{ 
        fontSize: {
          xs: '1.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '3rem'
        },
        padding: {
          xs: '1rem .5rem .5rem',
          xl: '1rem'
        }
      }}>
        {Math.abs(parseInt(speed))}
      </Box>
    </div>
  );

}

export default ThrottleSpeed;