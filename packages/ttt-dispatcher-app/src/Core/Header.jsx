import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Typography from '@mui/material/Typography';
import Stop from './Stop';
import Power from './Power';
import Settings from './Settings';
import StatusMonitor from '../Connections/StatusMonitor';
import { getByLink } from '../Shared/components/Config/Navigation';

import { useBreakpoints } from '../Shared/hooks/useBreakpoints';

export const Header = props => {


  const { 
    apiReady
  } = props;

  const [ isXs, isSm, isMd, isLg, isXl, up, down, getCurrentSize ] = useBreakpoints();
  

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
          <Link to="/settings" className="header-button">
          <IconButton
              className="header-button"
              color="inherit"
              aria-label="menu"
            >
              <SettingsIcon />
            </IconButton>
          </Link>
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
        <pre>
          {up.xs && (<>XSUP</>)}
          {up.sm && (<>SMUP</>)}
          {up.md && (<>MDUP</>)}
          {up.lg && (<>LGUP</>)}
          {up.xl && (<>XLUP</>)}

          {down.xs && (<>XSdown</>)}
          {down.sm && (<>SMdown</>)}
          {down.md && (<>MDdown</>)}
          {down.lg && (<>LGdown</>)}
          {down.xl && (<>XLdown</>)}
        </pre>
      </AppBar>
    </>
  );

}

export default Header;