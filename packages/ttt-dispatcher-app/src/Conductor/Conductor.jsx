import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

import CruiseThrottles from '../Throttles/CruiseThrottles';
import Throttles from '../Throttles/Throttles';
import Effects from '../Effects/Effects';
import Routes from '../Routes/Routes';
import Turnouts from '../Turnouts/Turnouts';

import api from '../Shared/api/api';
import { useBreakpoints } from '../Shared/hooks/useBreakpoints';
import { Context } from '../Store/Store';

import './Conductor.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  const [ isXs, isSm, isMd, isLg, isXl, getCurrentSize ] = useBreakpoints();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const Conductor = props => {

  const [tab, setTab] = useState(0);
  const [ state, dispatch ] = useContext(Context);
  const { turnouts, layout } = state;

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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderTurnouts = list => list
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by the abbr property
    .map(renderTurnout)   

    const renderTurnout = turnout => {
    console.log('renderTurnout', turnout);
    return (
      <Turnout key={turnout.turnoutId} turnout={turnout} handleTurnoutChange={handleTurnoutChange} />
    )
  }

  return (
    <>
      <Grid container
        direction="row"
        spacing={2}
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="stretch"
        sx={{ 
          height: {
            md: '100%',
            md: '100%',
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
              md: '100%',
              md: '100%',
              md: '100%',
              lg: '100%',
              xl: '100%',
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
          <Grid container
            direction="row"
            justifyContent="space-between"
            alignItems="stretch">
            <Grid item xs={12}>
              <CruiseThrottles />
            </Grid>
          </Grid>
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                textColor="secondary"
                indicatorColor="secondary"
                value={tab} 
                onChange={handleTabChange}>
                <Tab label="Turnouts" />
                <Tab label="Routes" />
                <Tab label="Effects" />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              {/* <Dispatcher overrideUserPrefs={true} enabled={['turnouts']} /> */}
              <Turnouts />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              {/* <Dispatcher overrideUserPrefs={true} enabled={['routes']} view="pill" /> */}
              <Routes setTurnouts={setTurnouts} view={'tiny'}  />
            </TabPanel>
            <TabPanel value={tab} index={2} className="conductor-effects">
              <Effects />
            </TabPanel>
        </Grid>
      </Grid>
    </>
  )
};

export default Conductor;