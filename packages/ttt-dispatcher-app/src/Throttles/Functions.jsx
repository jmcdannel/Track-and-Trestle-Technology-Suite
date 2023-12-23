import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HighlightIcon from '@mui/icons-material/Highlight';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

import './Functions.scss';

const defaultIcon = <NotificationsIcon />;

const functionIcons = {
  'Light': (<HighlightIcon />),
  'Bell': (<NotificationsIcon />),
  'Horn': (<VolumeUpIcon />),
  'Couplers': (<AudiotrackIcon />),
  'Brake': (<AudiotrackIcon />),
  'Mute': (<VolumeOffIcon />),
  'Notch Up': (<VolumeDownIcon />),
  'Notch Down': (<VolumeDownIcon />)
}

const allFunctions = Array(24).fill({}).map((item, idx) => ({
  label: `Function ${idx}`,
  icon: defaultIcon
}));

export const Functions = props => {

  const { onFunctionClick, functionMap } = props;

  const handleFunctionClick = functionIndex => {
    if (onFunctionClick) {
      onFunctionClick(functionIndex)
    }
  }

  const functionButtons = functionMap 
    ? functionMap.map(({ name, number }) => ({
        label: name || `Function ${number}`,
        icon: functionIcons[name] || defaultIcon
      }))
    : allFunctions;

  console.log('functionButtons', functionButtons)

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flex: '1 0 0',
      overflow: 'hidden',
      borderRadius: '1.5rem',
      height: 'fit-content',
      alignSelf: 'flex-end',
      alignItems: 'center',
      marginBottom: '2rem',
      background: 'linear-gradient(140deg, rgb(197, 51, 158) 0%, rgb(147, 38, 131) 100%)',
      padding: '0.5rem 1rem 0 1rem',
    }}>
      <Typography variant="h6" 
        component="div" 
        className="throttle__functions__title" >Functions </Typography>
      <ButtonGroup
        variant="text"
        size="large"
        className="rounded-button-group throttle__functions">

        {functionButtons.map((btn, idx) => idx < 12 && (
          <Button
            variant="outlined"
            key={`${btn.label}-${idx}`}
            size="small"
            color="primary"
            className="throttle__functions__btn"
            startIcon={btn.icon}
            onClick={() => handleFunctionClick(idx)}
          >
            {btn.label}
          </Button>
        ))}

      </ButtonGroup>
    </Box>
  );

}

export default Functions;