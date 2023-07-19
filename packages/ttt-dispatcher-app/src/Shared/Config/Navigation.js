import React from 'react';
import CallSplit from '@mui/icons-material/CallSplit';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import TrafficIcon from '@mui/icons-material/Traffic';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import TrainIcon from '@mui/icons-material/Train';

export const navConfig = {
  conductor: { link: '/', label: 'Conductor', icon: (<TrainIcon />) },
  turnouts: { link: '/dispatcher', label: 'Dispatcher', icon: (<CallSplit />) },
  throttles: { link: '/throttles', label: 'Throttle', icon: (<UnfoldMoreIcon />) },
  signals: { link: '/signals', label: 'Signals', icon: (<TrafficIcon />) },
  effects: { link: '/effects', label: 'Effects', icon: (<MovieFilterIcon />) }
}

export const getByLink = link => {
  const item = Object.keys(navConfig).reduce(function(result, curr) {
    if (navConfig[curr].link === link) {
      result = navConfig[curr];
    }
    return result;
  }, null);
  return item;
};

export default navConfig;