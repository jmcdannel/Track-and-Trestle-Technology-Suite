import React from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HighlightIcon from '@mui/icons-material/Highlight';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

export const Functions = props => {

  const { onFunctionClick, show, onHide } = props;

  const handleFunctionClick = functionIndex => {
    if (onFunctionClick) {
      onFunctionClick(functionIndex)
    }
  }

  const functionButtons = new Array(24).fill({}).map((item, idx) => {
    switch(idx) {
      case 0:
        return {
          label: 'Light',
          icon: (<HighlightIcon />)
        }
      case 1:
        return {
          label: 'Bell',
          icon: (<NotificationsIcon />)
        }
      case 2:
      case 3:
        return {
          label: 'Horn',
          icon: (<VolumeUpIcon />)
        }
      case 4:
        return {
          label: 'Couplers',
          icon: (<AudiotrackIcon />)
        }      
      case 5:
        return {
          label: 'Brake',
          icon: (<AudiotrackIcon />)
        }
      case 6:
        return {
          label: 'Brake',
          icon: (<AudiotrackIcon />)
        }
      case 8:
        return {
          label: 'Mute',
          icon: (<VolumeOffIcon />)
        }
      case 9:
        return {
          label: 'Notch Up',
          icon: (<VolumeDownIcon />)
        }      
      case 10:
        return {
          label: 'Notch Down',
          icon: (<VolumeDownIcon />)
        }
      default: 
        return {
          label: `Func ${idx}`,
          icon: (<NotificationsIcon />)
        }
    }
    
  });

  return (
    <Drawer
      anchor={'right'}
      open={show}
      onClose={onHide}
      >
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
    </Drawer>
  );

}

export default Functions;