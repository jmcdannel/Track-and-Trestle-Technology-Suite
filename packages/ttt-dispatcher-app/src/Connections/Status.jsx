import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiStatusbarConnectedNoInternet4OutlinedIcon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4Outlined';
import UsbOutlinedIcon from '@mui/icons-material/UsbOutlined';
import UsbOffOutlinedIcon from '@mui/icons-material/UsbOffOutlined';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Status = props => {

  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const status = useConnectionStore(state => state.status);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);

  const dccConnected = dccApiStatus === CONNECTION_STATUS.CONNECTED && dccDeviceStatus === CONNECTION_STATUS.CONNECTED;

  const allConnected = status === CONNECTION_STATUS.CONNECTED
    && dccApiStatus === CONNECTION_STATUS.CONNECTED
    && dccDeviceStatus === CONNECTION_STATUS.CONNECTED

  function renderIcon() {
    return allConnected
      ? <SignalWifiStatusbar4BarIcon sx={{ fill: '#21ff15' }} />
      : <SignalWifiStatusbarNullIcon sx={{ fill: 'red' }} />
  }
  function renderDccIcon() {
    return dccConnected
      ? <UsbOutlinedIcon sx={{ fill: '#21ff15' }} />
      : <UsbOffOutlinedIcon sx={{ fill: 'red' }} />
  }
  
  return (
    <>
      <Link to="/dcc">
        <Chip
          label="DCC"
          color={dccConnected ? 'info' : 'error'}
          size="small"
          icon={renderDccIcon()}
          variant='outlined'
          sx={{ mr: 2 }}
        />
      </Link>
      <Link to="/settings">
        <Chip
          label={`${host} * ${layoutId}`}
          color={allConnected ? 'info' : 'error'}
          size="small"
          icon={renderIcon()}
          variant='outlined'
          sx={{ mr: 2 }}
        />
      </Link>
    </>
  )
}

export default Status
