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
import { HostDialog } from './HostDialog';
import { LayoutDialog } from './LayoutDialog';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Host = props => {

  const { connection } = props;
  const [configOpen, setConfigOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [ state, dispatch ] = useContext(Context);
  const { layout } = state;
  const host = useConnectionStore(state => state.host);
  const layoutId = useConnectionStore(state => state.layoutId);
  const status = useConnectionStore(state => state.status);
  const setLayoutId = useConnectionStore(state => state.setLayoutId);
  const setHost = useConnectionStore(state => state.setHost);

  const connected = status === CONNECTION_STATUS.CONNECTED;

  const handleReset = () => {
    setHost(null);
    setLayoutId(null);
  }

  const connectionStateColor = () => {
    if (connected && layoutId) {
      return '#21ff15';
    } else if (connected && !layoutId) {
      return 'yellow';
    } else if (!connected && layoutId) {
      return 'orange';
    } else if (!connected && !layoutId) {
      return 'red';
    }
  }
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="Host" 
          avatar={
            connected 
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
            {connected 
                ? <SignalWifiStatusbar4BarIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon sx={{ fill: connectionStateColor(), fontSize: '8rem' }} />}
          </Box>

          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>            

            <Typography>Host:</Typography>
            <Chip 
              label={host ? host : <Skeleton width={50} />}
              onDelete={() => setHost(null)} />
            
            <Typography>Status: </Typography>
            <Chip label={status || 'unknown'} /> 
            
            <Typography>Layout: </Typography>
            <Chip 
              label={layoutId ? layoutId : <Skeleton width={50} />}
              onDelete={() => setLayoutId(null)} />
            
          </Stack>
        </CardContent>
        <CardActions>
          {!connected && (<Button onClick={() => setConfigOpen(true)} variant="outlined">Connect</Button>)}
          {!layoutId && (<Button onClick={() => setLayoutOpen(true)} disabled={!connected} variant="outlined">Select</Button>)}
          {(connected || layoutId) && (<Button onClick={handleReset} variant="outlined">Reset</Button>)}
        </CardActions>
        
      </Card>

      <HostDialog
        onClose={() => setConfigOpen(false)} 
        open={configOpen}
      />
      <LayoutDialog
        onClose={() => setLayoutOpen(false)} 
        open={layoutOpen}
      />
    </>
  );
}

export default Host;
