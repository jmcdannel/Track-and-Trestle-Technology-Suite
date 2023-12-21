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

import { Context } from '../Store/Store';
import { DccApiDialog } from './DccApiDialog';
import { DccDeviceDialog } from './DccDeviceDialog';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Dcc = props => {

  const { connection } = props;
  const [configOpen, setConfigOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [ state, dispatch ] = useContext(Context);
  const { layout } = state;
  const dccHost = useConnectionStore(state => state.dccHost);
  const dccDevice = useConnectionStore(state => state.dccDevice);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);
  const setDccHost = useConnectionStore(state => state.setDccHost);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);

  const apiConnected = dccApiStatus === CONNECTION_STATUS.CONNECTED;
  const deviceConnected = dccDeviceStatus === CONNECTION_STATUS.CONNECTED;

  const connectionStateColor = () => {
    if (apiConnected && deviceConnected) {
      return '#21ff15';
    } else if (apiConnected && !deviceConnected) {
      return 'yellow';
    } else if (!apiConnected && deviceConnected) {
      return 'orange';
    } else if (!apiConnected && !deviceConnected) {
      return 'red';
    }
  }
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="DCC" 
          avatar={
            apiConnected && deviceConnected 
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
            {apiConnected && deviceConnected 
                ? <SignalWifiStatusbar4BarIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />}
          </Box>
          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>
            <Typography>Host:</Typography>
            <Chip 
              label={dccHost ? dccHost : <Skeleton width={120} />} 
              onDelete={() => setDccHost(null)}
            />
            
            <Typography>Status: </Typography>
            <Chip label={dccApiStatus || 'unknown'} />    

            <Typography>Device: </Typography>
            <Chip 
              label={dccDevice ? dccDevice : <Skeleton width={120} />} 
              onDelete={() => setDccDevice(null)}
            /> 
                    
            <Typography>Status: </Typography>
            <Chip label={dccDeviceStatus || 'unknown'} />   

          </Stack>
        </CardContent>
        <CardActions>
          <Button onClick={() => setConfigOpen(true)} variant="outlined">Connect</Button>
          <Button onClick={() => setDeviceOpen(true)} disabled={!apiConnected} variant="outlined">Select</Button>
        </CardActions>        
      </Card>
      <DccApiDialog
        onClose={() => setConfigOpen(false)} 
        open={configOpen}
      />
      <DccDeviceDialog
        onClose={() => setDeviceOpen(false)} 
        open={deviceOpen}
      />
    </>
  );
}

export default Dcc;
