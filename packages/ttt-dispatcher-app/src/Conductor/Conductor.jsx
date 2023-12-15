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
        spacing={2}
        justifyContent="space-between"
        flexWrap="wrap"
        alignItems="stretch">
        <Grid item 
          xs={12} sm={12} md={8}>
          {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: { xs: 'inline', sm: 'none', md: 'none' } }}>XS</Box>
            <Box sx={{ display: { xs: 'none', sm: 'inline', md: 'none' } }}>SM</Box>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>MD</Box>
          </Box> */}

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
        <Grid item xs={12} sm={12} md={4} className="App-content__conductor">
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
        </Grid>
      </Grid>
    </>
  )
};

export default Conductor;