import React, { useContext } from 'react';

import Grid from '@mui/material/Grid';

import DispatcherMenu from './DispatcherMenu';
import Routes from '../Routes/Routes';
import RouteMap from '../Routes/RouteMap';
import Turnout from '../Turnouts/Turnout';

import api from '../Api';
import { Context } from '../Store/Store';

import './Dispatcher.scss';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TURNOUT_DELAY = 1000; // ms

export const Dispatcher = props => {

  const { filter, enabled, overrideUserPrefs, view } = props;
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
    <Grid container sx={{ alignContent: 'flex-start' }}>
      {isVisible('menu') && (
        <Grid item sm={12}>
          <DispatcherMenu setTurnouts={setTurnouts}  />
        </Grid>
      )}

      {isVisible('map') && (
        <Grid item sm={12} className="dispatcher__routemap" >
          <RouteMap setTurnouts={setTurnouts} handleTurnoutChange={handleTurnoutChange} />
        </Grid>
      )}

      {isVisible('routes') && (
        <Grid item sm={12} p={2}>
          <Routes setTurnouts={setTurnouts} view={view}  />
      </Grid>
      )}
      
      {isVisible('turnouts') && (
        <Grid item sm={12} p={2}>
          <Grid container className={`turnouts turnouts--${view}`} spacing={2}>
            <Grid item sm={12} className="turnout__grid-item">
              {turnouts?.filter(filter).map(turnout => (
                <div key={`turnout$${turnout.turnoutId}`} className="turnout__container">
                    <Turnout turnout={turnout} handleTurnoutChange={handleTurnoutChange} />
                </div>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  ) : null;

}

Dispatcher.defaultProps = {
  filter: turnouts => turnouts,
  enabled: ['menu'],
  overrideUserPrefs: false,
  view: 'tiny'
};

export default Dispatcher;