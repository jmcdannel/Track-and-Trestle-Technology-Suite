import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CallSplit from '@mui/icons-material/CallSplit';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import UsbIcon from '@mui/icons-material/Usb';

import { ActionDeviceDialog } from './ActionDeviceDialog';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const ActionDevice = props => {

  const { device } = props;
  const [deviceOpen, setDeviceOpen] = useState(false);

  const deviceConnected = device?.status === CONNECTION_STATUS.CONNECTED;

  const connectionStateColor = () => {
    if (deviceConnected) {
      return '#21ff15';
    } else {
      return 'red';
    }
  }
  
  
  return (
    <>
      <Box>
        {/* <pre>{ JSON.stringify(device, null, 2) }</pre> */}
        <Chip 
          sx={{
            borderColor: connectionStateColor()
          }}
          label={device.id ? `${device.id}:${device.port}` : <Skeleton width={120} />} 
          onDelete={() => setDccDevice(null)}
          onClick={() => setDeviceOpen(true)}
          icon={
            <UsbIcon 
              className={`status--${deviceConnected ? 'connected' : 'disconnected'}`} 
              sx={{ paddingLeft: '.5rem' }} 
            />
          }
        />
      </Box>
      <ActionDeviceDialog
        device={device}
        onClose={() => setDeviceOpen(false)} 
        open={deviceOpen}
      />
    </>
  );
}

export default ActionDevice;
