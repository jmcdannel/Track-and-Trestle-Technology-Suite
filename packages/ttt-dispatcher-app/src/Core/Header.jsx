import React from 'react';
import { useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stop from './Stop';
import Power from './Power';
import Status from '../Connections/Status';
import { getByLink } from '../Shared/components/Config/Navigation';

export const Header = () => {

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