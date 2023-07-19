import React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const Signal = props => {

  const { effect, effect: { effectId }, onChange, getMetaData } = props;

  const handleChange = (event, newValue) => {
    onChange({ effectId, state: newValue });
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
          <ToggleButton value="red">
            <FiberManualRecordIcon style={{color: 'red', opacity: effect.state === 'red' ? 1 : .1 }} />
          </ToggleButton>
          <ToggleButton value="yellow">
            <FiberManualRecordIcon style={{color: 'yellow', opacity: effect.state === 'yellow' ? 1 : .1 }} />
          </ToggleButton>
          <ToggleButton value="green" >
            <FiberManualRecordIcon style={{color: 'green', opacity: effect.state === 'green' ? 1 : .1 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>  
  );
}

export default Signal;