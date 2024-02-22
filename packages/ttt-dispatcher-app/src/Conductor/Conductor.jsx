import React from 'react';

import Grid from '@mui/material/Grid';

import Throttles from '../Throttles/Throttles';
import ConductorTabs from './ConductorTabs';

import './Conductor.scss';

export const Conductor = () => {
  return (
      <Grid container
        direction="row"
        spacing={2}
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="stretch"
        sx={{ 
          height: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%',
            },
           overflow: 'auto'
        }}>
        <Grid item
          xs={12} sm={12} md={8} 
          sx={{ 
            height: {
              xs: '100%',
              sm: '100%',
              md: '100%',
              lg: '100%',
              xl: '100%',
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
          <Throttles />
        </Grid>
        <Grid item xs={12} sm={12} md={4} 
        sx={{ 
          height: {
            xs: 'auto',
            sm: 'auto',
            md: '100%',
            lg: '100%',
            xl: '100%',
            },
           overflow: 'auto'
        }}>
          <ConductorTabs />
        </Grid>
      </Grid>
  )
};

export default Conductor;