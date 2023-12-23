import React, { useContext } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import DispatcherMenu from './DispatcherMenu';
import Route from '../Routes/Route';
import RouteMap from '../Routes/RouteMap';
import Turnout from '../Turnouts/Turnout';
import withRouteEngine from '../Routes/withRouteEngine';

import api from '../Shared/api/api';
import { Context } from '../Store/Store';

import './Dispatcher.scss';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TURNOUT_DELAY = 10; // ms

export const Dispatcher = props => {

  const { 
    filter, 
    enabled, 
    overrideUserPrefs, 
    computedRoutes, 
    handleRouteToggle 
  } = props;
  const [ state, dispatch ] = useContext(Context);
  const { turnouts } = state;
  const dispatcherLayout = state.userPreferences.dispatcherLayout;

  const setTurnouts = async deltas => {
    deltas.map(async (delta, idx) => {
      await sleep(idx * TURNOUT_DELAY);
      await handleTurnoutChange(delta);
    });
  }

  const handleTurnoutChange = async delta => {
    try {
      console.log('handleTurnoutChange', delta);
      await api.turnouts.put(delta);
      await dispatch({ type: 'UPDATE_TURNOUT', payload: delta });
    } catch (err) {
      console.error(err);
      // throw err;
    }   
  }

  const isVisible = (item) => overrideUserPrefs
    ? enabled.includes(item)
    : enabled.includes(item) || !!dispatcherLayout[item];
  
  return turnouts ? (
    <Box sx={{ 
      alignContent: 'flex-start',
      overflow:'auto',
      flex: '1'
      }}>
      {isVisible('menu') && (
        <DispatcherMenu setTurnouts={setTurnouts}  />
      )}

      {isVisible('map') && (
        <RouteMap setTurnouts={setTurnouts} handleTurnoutChange={handleTurnoutChange} />
      )}

      {isVisible('routes') && (
        <Box className="routes">
          {computedRoutes.map(rte => (
            <Box 
              key={rte.routeId} 
              sx={{
                padding: '.25rem',
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 50%',
                  md: '1 1 33%',
                  lg: '1 1 25%',
                  xl: '1 1 20%',
                },
                maxWidth: {
                  xs: '100%',
                  sm: '50%',
                  md: '33%',
                  lg: '25%',
                  xl: '20%',
              }
            }}>
              <Route 
                className={rte.className} 
                route={rte} 
                handleRouteToggle={handleRouteToggle} 
              />
            </Box>
          ))}
        </Box>
      )}
      
      {isVisible('turnouts') && (
        <Box className="turnouts">        
        {turnouts?.filter(filter).map(turnout => (
            <Box 
              key={`turnout$${turnout.turnoutId}`} 
              sx={{
                padding: '.25rem',
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 50%',
                  md: '1 1 33%',
                  lg: '1 1 25%',
                  xl: '1 1 20%',
                },
                maxWidth: {
                  xs: '100%',
                  sm: '50%',
                  md: '33%',
                  lg: '25%',
                  xl: '20%',
                }
              }}>
              <Turnout turnout={turnout} handleTurnoutChange={handleTurnoutChange} />
            </Box>
          ))}            
        </Box>
      )}
    </Box>
  ) : null;

}

Dispatcher.defaultProps = {
  filter: turnouts => turnouts,
  enabled: ['menu'],
  overrideUserPrefs: false
};

export default withRouteEngine(Dispatcher);