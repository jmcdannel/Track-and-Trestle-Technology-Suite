import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrainIcon from '@mui/icons-material/Train';
import navConfig from '../Shared/Config/Navigation';
import { useLocation } from "react-router-dom";
import { Context } from '../Store/Store';

export const Footer = () => {

  const [ state ] = useContext(Context);
  const { layout } = state;
  const location = useLocation();

  return (
    <BottomNavigation
      value={location.pathname}
      className="app-footer"
    >
      <BottomNavigationAction 
        label="Conductor" 
        value="/" 
        to="" 
        icon={<TrainIcon />} 
        component={Link} 
      />
      {layout?.modules && layout?.modules.filter(module => !!navConfig[module]).map(module => (
        <BottomNavigationAction 
          key={module} 
          label={navConfig[module].label} 
          value={`${navConfig[module].link}`} 
          to={`${navConfig[module].link}`} 
          icon={navConfig[module].icon} 
          component={Link} 
        />
      ))}
    </BottomNavigation>
  );

}

export default Footer;