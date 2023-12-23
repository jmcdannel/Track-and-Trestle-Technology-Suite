import React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const Signal = props => {

  const { effect, effect: { effectId }, onChange, getMetaData } = props;

  const handleChange = (event, newValue) => {
    onChange({ ...effect, state: newValue });
  };

  const isSmallView = true;

  return (
    <Grid container direction="row">
      {!isSmallView && (<Grid item xs={9}>
        {getMetaData(effect)}
      </Grid>)}
      <Grid item xs={isSmallView ? 12 : 3}>
        <ToggleButtonGroup 
          size="small" 
          orientation={isSmallView ? 'horizontal' : 'vertical'}
          value={effect.state} 
          exclusive 
          onChange={handleChange}>
            {['red', 'yellow', 'green'].map(color => 
              effect.config[color] ? (
                <ToggleButton key={color} value={color}>
                  <FiberManualRecordIcon style={{color, opacity: effect.state === color ? 1 : .1 }} />
                </ToggleButton> 
              ) : null
            )}
        </ToggleButtonGroup>
      </Grid>
    </Grid>  
  );
}

export default Signal;