import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';;
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';

import { ActionDevice } from './ActionDevice';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';
import { useMqtt } from '../Core/Com/MqttProvider'

export const Actions = props => {

  const actionDevices = useConnectionStore(state => state.actionDevices);
  const { isConnected: mqttConnected } = useMqtt();


  const devicesConnected = actionDevices.length > 0 &&
    actionDevices.every(device => device.status === CONNECTION_STATUS.CONNECTED);

  const connectionStateColor = () => {
    if (mqttConnected && devicesConnected) {
      return '#21ff15';
    } else if (mqttConnected && !devicesConnected) {
      return 'yellow';
    } else if (!mqttConnected && devicesConnected) {
      return 'orange';
    } else if (!mqttConnected && !devicesConnected) {
      return 'red';
    }
  }
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="Actions" 
          avatar={
            mqttConnected && devicesConnected 
              ? <SignalWifiStatusbar4BarIcon sx={{ fill: connectionStateColor() }} />
              : <SignalWifiStatusbarNullIcon sx={{ fill: connectionStateColor() }} />
          } >
        </CardHeader>
        <CardContent sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
          <Box sx={{ padding: '1rem' }}>
            {mqttConnected && devicesConnected 
                ? <SignalWifiStatusbar4BarIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />}
          </Box>
          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>                        
            <Typography>Status: {mqttConnected ? 'connected' : 'disconnected'}</Typography>
            <Chip label={mqttConnected?.toString() || 'unknown'} />   
      
            {actionDevices?.map((device, index) => 
              <ActionDevice key={`device.${index}`} device={device} />
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default Actions;
