import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
import Status from '../Connections/Status';
import { getByLink } from '../Shared/components/Config/Navigation';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Header = props => {

  const status = useConnectionStore(state => state.status);
  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);

  let location = useLocation();
  const navItem = getByLink(location.pathname);

  return (
    <AppBar position="sticky" className="">
      <Toolbar>
        <Typography variant="h6" className="title" align="left">
          {navItem ? navItem.label : ''}
        </Typography>
        <Status />
        <Stop />
        <Power />
      </Toolbar>
    </AppBar>
  );

}

export default Header;