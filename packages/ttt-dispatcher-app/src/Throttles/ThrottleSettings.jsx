import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ExpandIcon from '@mui/icons-material/Expand';
import CompressIcon from '@mui/icons-material/Compress';

import { ThrottleConsist } from './ThrottleConsist';
import { useLocoStore } from '../Store/useLocoStore';

export const ThrottleSettings = props => {
  
  const { loco, maxSpeed, show, onHide, loco: { consist } } = props;
  const address = Number(props.loco.address);

  const locos = useLocoStore(state => state.locos);
  const updateLoco = useLocoStore(state => state.updateLoco);

  const handlePrecisionChange = async (event) => {
    try {
      await updateLoco({ address, maxSpeed: event.target.value });
    } catch (err) {
      console.error(err);
    }
  }

  const handleConsistChange = async (consist) => {
    try {
      console.log('newConsist', consist);
      await updateLoco({ address, consist });
    } catch (err) {
      console.error(err);
    }
  }

  const handleStickyThrottleClick = async () => {
    try {
      await updateLoco({ address, autoStop: !loco.autoStop });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Drawer
      anchor={'right'}
      open={show}
      onClose={onHide}
      >
        <Paper style={{ minWidth: '25vw', maxWidth: '75vw', width: '100vw', padding: '1rem 2rem' }}>
        <h1>Settings</h1>
        <Grid container spacing={2} direction="row">
          <Grid item xs={6}>

            <FormControl fullWidth sx={{ padding: '1rem' }}>
              <InputLabel id="minmax-label">Precison</InputLabel>
              <Select
                labelId="minmax-label"
                id="minmax"
                value={maxSpeed}
                label="Precison"
                onChange={handlePrecisionChange}
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>

            <Button 
              className="width100 textLeft" 
              onClick={handleStickyThrottleClick} 
              label="Auto Stop" 
              variant="outlined" 
              startIcon={loco.autoStop  ? <CompressIcon /> : <ExpandIcon/>} >
                Auto Stop
            </Button>
            
          </Grid>
          <Grid item xs={6}>
            <ThrottleConsist consist={consist} locos={locos} onChange={handleConsistChange} />
          </Grid>
        </Grid>

        

      </Paper>   
    </Drawer>
  );
}

export default ThrottleSettings;
