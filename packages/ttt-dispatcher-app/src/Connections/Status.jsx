import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiStatusbarConnectedNoInternet4OutlinedIcon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4Outlined';
import UsbOutlinedIcon from '@mui/icons-material/UsbOutlined';
import UsbOffOutlinedIcon from '@mui/icons-material/UsbOffOutlined';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useMqtt } from '../Core/Com/MqttProvider'

export const Status = () => {

  const { isConnected: mqttConnected } = useMqtt();
  const layoutId = useConnectionStore(state => state.layoutId);
  const status = useConnectionStore(state => state.status);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);

  const dccConnected = mqttConnected && dccDeviceStatus === CONNECTION_STATUS.CONNECTED;

  const allConnected = status === CONNECTION_STATUS.CONNECTED
    && mqttConnected
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
          sx={{ 
            display: {
              xs: 'none',
              sm: 'flex'
            },
            mr: 2 
          }}
        />
        <Box sx={{ mr: 2, display: { sx: 'flex', sm: 'none' } }}>
          {renderDccIcon()}
        </Box>
      </Link>
      <Link to="/settings">
        <Chip
          label={`${layoutId}`}
          color={allConnected ? 'info' : 'error'}
          size="small"
          icon={renderIcon()}
          variant='outlined'
          sx={{ 
            display: {
              xs: 'none',
              sm: 'flex'
            },
            mr: 2 
          }}
        />
        <Box sx={{ mr: 2, display: { xs: 'flex', sm: 'none' } }}>
          {renderIcon()}
        </Box>
      </Link>
    </>
  )
}

export default Status
