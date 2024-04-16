import React, { useContext } from 'react';
import { Link , useLocation} from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import TrainIcon from '@mui/icons-material/Train';
import navConfig from '../Shared/components/Config/Navigation';
import { useLayoutStore } from '../Store/useLayoutStore';

export const Footer = () => {

  const layout = useLayoutStore(state => state.layout);
  const location = useLocation();

  return (
    <>
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
    </>
  );

}

export default Footer;