import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

import { useLocoStore } from '../Store/useLocoStore';

const ThrottleActions = (props) => {

  const { 
    onShowSettings, 
    onShowFunctions, 
    onShowConsist,
    onStop, 
    cruiseDisabled, 
    size = 'large' ,
    showFunctions = true,
    showCruiseControl = true,
    showPark = true,
    showSettings = true
  } = props;
  const address = Number(props.loco.address);

  const updateLoco = useLocoStore(state => state.updateLoco);

  const iconStyle = {
  }  

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowFunctionClick = () => {
    onShowFunctions();
  }

  const handleShowSettingsClick = () => {
    onShowSettings();
  }

  const handleCruiceControlClick = async () => {
    try {
      await updateLoco( { address, cruiseControl: true });
    } catch (err) {
      console.error(err);
    }
  }

  const handleConsistClick = () => {
    onShowConsist();
  }

  const handleParkClick = async () => {
    try {
      onStop();
      await updateLoco( { address, isAcquired: false, cruiseControl: false });
    } catch (err) {
      console.error(err);
    }    
  }

  return (    
    <>
      <slot></slot>
      <Tooltip title="Options">
        <IconButton 
          className="options"
          onClick={handleClick}
          size={size}>
          <MoreVertIcon sx={iconStyle} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            textAlign: 'left',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleShowFunctionClick}>
          <ListItemIcon>
            <TrainIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Functions</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={handleCruiceControlClick}
          disabled={cruiseDisabled} >
          <ListItemIcon>
            <SpeedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cruise Control</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleParkClick}>
          <ListItemIcon>
            <LocalParkingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Park</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleConsistClick}>
          <ListItemIcon>
            <Box sx={{ position: 'relative' }}>
              <TrainIcon sx={{ fontSize: '1rem', position: 'relative', left: '-5px', top: '-5px'}} />
              <TrainIcon sx={{ fontSize: '1rem', position: 'absolute', left: '5px', top: '5px', color: '#00FF00' }} />
            </Box>
          </ListItemIcon>
          <ListItemText>Consist</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShowSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThrottleActions;
