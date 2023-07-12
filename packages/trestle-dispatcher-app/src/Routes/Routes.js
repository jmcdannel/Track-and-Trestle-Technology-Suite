import React from 'react';

import withRouteEngine from '../Routes/withRouteEngine';
import Route from '../Routes/Route';

import Grid from '@mui/material/Grid';

import './Routes.scss';

const lineColors = {
  'Valley': 'rgb(13, 242, 40)',
  'Tamarack Station': 'rgb(0, 255, 253)',
  'Valley City': 'rgb(206, 217, 38)'
}

const Routes = props => {

  const { 
    handleRouteToggle,
    computedRoutes,
    view
  } = props;

  return (
    <Grid container>
      <Grid item sm={12} >
        <Grid container spacing={view === 'pill' ? 0 : 1} className={`routes routes--${view}`}>
          {computedRoutes.map(rte => (
            <Grid item xs="auto" key={rte.routeId} sx={{ borderBottomColor: lineColors[rte.line] }}>
              <Route className={rte.className} route={rte} handleRouteToggle={handleRouteToggle} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

}

export default withRouteEngine(Routes);