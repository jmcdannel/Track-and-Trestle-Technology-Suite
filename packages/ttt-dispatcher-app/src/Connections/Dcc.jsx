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
import UsbIcon from '@mui/icons-material/Usb';
import UsbOffIcon from '@mui/icons-material/UsbOff';
import RouterIcon from '@mui/icons-material/Router';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import UsbOutlinedIcon from '@mui/icons-material/UsbOutlined';
import UsbOffOutlinedIcon from '@mui/icons-material/UsbOffOutlined';

import { DccDeviceDialog } from './DccDeviceDialog';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Dcc = props => {

  const { isConnected: mqttConnected, broker } = useMqtt();
  const [deviceOpen, setDeviceOpen] = useState(false);
  const dccDevice = useConnectionStore(state => state.dccDevice);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);

  const connectionStateColor = () => {
    if (mqttConnected && deviceConnected) {
      return '#21ff15';
    } else if (mqttConnected && !deviceConnected) {
      return 'yellow';
    } else if (!mqttConnected && deviceConnected) {
      return 'orange';
    } else if (!mqttConnected && !deviceConnected) {
      return 'red';
    }
  }
  
  const deviceConnected = dccDeviceStatus === CONNECTION_STATUS.CONNECTED;
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="DCC" 
          avatar={
            mqttConnected && deviceConnected 
              ? <UsbOutlinedIcon sx={{ fill: connectionStateColor() }} />
              : <UsbOffOutlinedIcon sx={{ fill: connectionStateColor() }} />
          } >
        </CardHeader>
        <CardContent sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
          <Box sx={{ padding: '1rem' }}>
            {mqttConnected && deviceConnected 
                ? <UsbOutlinedIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />
                : <UsbOffOutlinedIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />}
          </Box>
          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>
            
            <Typography>MQTT:</Typography>
            <Chip 
              sx={{ justifyContent: 'space-between' }}              
              icon={
                <RouterIcon 
                  className={`status--${mqttConnected ? 'connected' : 'disconnected'}`} 
                  sx={{ paddingLeft: '.5rem' }} 
                />
              }
              label={broker ? broker : <Skeleton width={150} />}
              onDelete={() => {}} />             

            <Typography>DCC-EC Command Station: </Typography>
            <Chip 
              onClick={() => setDeviceOpen(true)}
              sx={{ justifyContent: 'space-between' }}              
              icon={deviceConnected 
                ? <UsbIcon 
                    sx={{ paddingLeft: '.5rem' }} 
                    className={`status--${dccDeviceStatus}`} />
                : <UsbOffIcon 
                    sx={{ paddingLeft: '.5rem' }} 
                    className={`status--${dccDeviceStatus}`} />
              }
              label={dccDevice ? dccDevice : <Skeleton width={150} />}
              onDelete={() => setDccDevice(null)}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setDccDevice(null)} 
            color="secondary"
            variant="outlined">
              Reset
          </Button>
          <Button onClick={() => setDeviceOpen(true)} disabled={!mqttConnected} variant="outlined">Select</Button>          
        </CardActions>        
      </Card>
      <DccDeviceDialog
        onClose={() => setDeviceOpen(false)} 
        open={deviceOpen}
      />
    </>
  );
}

export default Dcc;
