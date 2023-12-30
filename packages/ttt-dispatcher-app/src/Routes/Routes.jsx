import React from 'react';
import Box from '@mui/material/Box';

import withRouteEngine from '../Routes/withRouteEngine';
import Route from '../Routes/Route';

import './Routes.scss';

const Routes = props => {

  const { 
    handleRouteToggle,
    computedRoutes
  } = props;


  return (
    <Box className="routes">
     {computedRoutes.map(rte => (
        <Route key={rte.routeId} className={rte.className} route={rte} handleRouteToggle={handleRouteToggle} />
      ))}
    </Box>
  );

}

export default withRouteEngine(Routes);