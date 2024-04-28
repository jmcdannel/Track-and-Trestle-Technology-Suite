import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Turnouts from '../Turnouts/Turnouts';
import Routes from '../Routes/Routes';
import Effects from '../Effects/Effects';

const routesDisabled = true; // routes disabled, considering depracation do to lack of use

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
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
    </Box>
  );
}

function ConductorTabs() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          textColor="secondary"
          indicatorColor="secondary"
          value={tab} 
          onChange={handleTabChange}
        >
          <Tab label="Turnouts" />
          <Tab label="Effects" />
          {!routesDisabled && (<Tab label="Routes" />)}
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <Turnouts />
      </TabPanel>
      <TabPanel value={tab} index={1} className="conductor-effects">
        <Effects />
      </TabPanel>
      {!routesDisabled && (<TabPanel value={tab} index={2}>
        <Routes />
      </TabPanel>)}
    </>
  );
}

export default ConductorTabs;