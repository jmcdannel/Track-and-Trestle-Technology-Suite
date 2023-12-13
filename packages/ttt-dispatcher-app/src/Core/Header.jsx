import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Typography from '@mui/material/Typography';
import Stop from './Stop';
import Power from './Power';
import Settings from './Settings';
import StatusMonitor from '../Connections/StatusMonitor';
import { getByLink } from '../Shared/components/Config/Navigation';
import { useLocation } from "react-router-dom";

export const Header = props => {


  const { 
    apiReady
  } = props;

  let location = useLocation();
  const navItem = getByLink(location.pathname);

  return (
    <>
      <AppBar position="sticky" className="app-header-menu">
        <Toolbar>
          <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            {navItem ? navItem.label : '[unknown]'}
          </Typography>
          <Paper sx={{ padding: '.5rem', display: { xs: 'none', sm: 'block' }}}>
            <StatusMonitor apiReady={apiReady} />
          </Paper>
          <Stop />
          <Power />
          <Settings />
          <IconButton
              className="header-button"
              color="inherit"
              aria-label="menu"
            >
            <Badge badgeContent={100} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );

}

export default Header;