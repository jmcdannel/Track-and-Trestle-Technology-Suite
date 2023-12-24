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
import RouterIcon from '@mui/icons-material/Router';
import LinkIcon from '@mui/icons-material/Link';
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

  const computeOverallStatus = () => {
    if (connected && layoutId) {
      return CONNECTION_STATUS.CONNECTED;
    } else if (connected && !layoutId) {
      return CONNECTION_STATUS.PENDING;
    } else if (!connected && layoutId) {
      return CONNECTION_STATUS.DISCONNECTED; // partially connected here
    } else if (!connected && !layoutId) {
      return CONNECTION_STATUS.DISCONNECTED;
    }
  }

  const connected = status === CONNECTION_STATUS.CONNECTED;
  const layoutStatus = layoutId ? 'connected' : 'disconnected';
  const overallStatus = computeOverallStatus();

  const handleReset = () => {
    setHost(null);
    setLayoutId(null);
  }
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="Host" 
          avatar={
            connected 
              ? <SignalWifiStatusbar4BarIcon className={`status--${overallStatus}`} />
              : <SignalWifiStatusbarNullIcon className={`status--${overallStatus}`} />
          } >
        </CardHeader>
        <CardContent sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
          <Box sx={{ padding: '1rem' }}>
            {connected 
                ? <SignalWifiStatusbar4BarIcon className={`status--${overallStatus}`} sx={{ fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon className={`status--${overallStatus}`} sx={{ fontSize: '8rem' }} />}
          </Box>

          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>            

            <Typography>Host:</Typography>
            <Chip 
              sx={{ justifyContent: 'space-between' }}
              onClick={() => setConfigOpen(true)}
              icon={
                <RouterIcon 
                  className={`status--${status}`} 
                  sx={{ paddingLeft: '.5rem' }} 
                />
              }
              label={host ? host : <Skeleton width={150} />}
              onDelete={() => setHost(null)} />
                        
            <Typography>Layout: </Typography>
            <Chip 
              sx={{ justifyContent: 'space-between' }}
              icon={
                <LinkIcon 
                  className={`status--${layoutStatus}`}
                  sx={{ paddingLeft: '.5rem' }} 
                />
              }
              onClick={() => setLayoutOpen(true)}
              label={layoutId ? layoutId : <Skeleton width={150} />}
              onDelete={() => setLayoutId(null)} />
            
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            onClick={handleReset} 
            color="secondary"
            variant="outlined">
              Reset
          </Button>
          <Box>
            <Button 
              onClick={() => 
              setLayoutOpen(true)} 
              disabled={!connected} 
              variant="contained">
                Select Layout
            </Button>
            <Button 
              onClick={() => setConfigOpen(true)} 
              variant="contained">
                Connect
            </Button>
          </Box>
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
