import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';

export const Settings = () => {
  
  const [settingsOpen, setSettingsOpen] = useState(false);


  const handleSettingsClick = () => {
    setSettingsOpen(true);
  }
  const handleSettingsClose = () => {
    setSettingsOpen(false);
  }

  return (
    <>
      <IconButton
        className="header-button"
        color="inherit"
        aria-label="menu"
        onClick={handleSettingsClick}
      >
        <SettingsIcon />
      </IconButton>
      <Drawer
        anchor={'top'}
        open={settingsOpen}
        onClose={handleSettingsClose}>
        <Box
          sx={{ width: 'auto', height: 250, padding: '10rem' }}
          role="presentation"
          onClick={handleSettingsClose}
          onKeyDown={handleSettingsClose}
        >
          <Paper>
            Settings
          </Paper>        
        </Box>
      </Drawer>
    </>
  );
}

export default Settings;
