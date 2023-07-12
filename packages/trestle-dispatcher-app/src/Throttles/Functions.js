import React from 'react';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HighlightIcon from '@mui/icons-material/Highlight';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

export const Functions = props => {

  const { onFunctionClick } = props;

  const handleFunctionClick = functionIndex => {
    if (onFunctionClick) {
      onFunctionClick(functionIndex)
    }
  }

  const functionButtons = new Array(8).fill({}).map((item, idx) => {
    switch(idx) {
      case 0:
        return {
          label: 'Horn',
          icon: (<ShareIcon />)
        }
      case 1:
        return {
          label: 'Light',
          icon: (<HighlightIcon />)
        }
      case 2:
        return {
          label: 'Whistle',
          icon: (<ShareIcon />)
        }
      case 3:
        return {
          label: 'Bell',
          icon: (<NotificationsIcon />)
        }
      default: 
        return {
          label: `Func ${idx+1}`,
          icon: (<NotificationsIcon />)
        }
    }
    
  });

  return (
    <div className="throttle__functions">
      <div className="throttle__functions__viewport">

        {functionButtons.map((btn, idx) => (
          <Button
            variant="outlined"
            key={btn.label}
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