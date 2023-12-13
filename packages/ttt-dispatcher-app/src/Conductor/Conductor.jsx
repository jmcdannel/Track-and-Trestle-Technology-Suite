import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

import CruiseThrottles from '../Throttles/CruiseThrottles';
import Throttles from '../Throttles/Throttles';
import Effects from '../Effects/Effects';
import Dispatcher from '../Dispatcher/Dispatcher';

import './Conductor.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="stretch">
        <Grid item xs={8} className="flex height100" flexWrap="wrap">

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
        <Grid item xs={4} className="App-content__conductor">
          <Grid container direction="column">
            <Grid item mt={2}>
              <Paper elevation={3} style={{ padding: '0.5rem' }} square>
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
                  <Dispatcher overrideUserPrefs={true} enabled={['turnouts']} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Dispatcher overrideUserPrefs={true} enabled={['routes']} view="pill" />
                </TabPanel>
                <TabPanel value={tab} index={2} className="conductor-effects">
                  <Effects />
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
};

export default Conductor;