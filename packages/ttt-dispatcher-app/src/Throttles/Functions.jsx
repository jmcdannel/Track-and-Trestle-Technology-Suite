import React from 'react';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HighlightIcon from '@mui/icons-material/Highlight';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

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
    <div className="throttle__functions">
      <div className="throttle__functions__viewport">

        {functionButtons.map((btn, idx) => (
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

      </div>
    </div>
  );

}

export default Functions;