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

import { LayoutDialog } from './LayoutDialog';
import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Host = props => {

  const { connection } = props;
  const [configOpen, setConfigOpen] = useState(false);
  const layoutId = useConnectionStore(state => state.layoutId);

  const connected = status === CONNECTION_STATUS.CONNECTED;
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="Layout" 
          avatar={
            connected 
              ? <SignalWifiStatusbar4BarIcon sx={{ fill: '#21ff15' }} />
              : <SignalWifiStatusbarNullIcon sx={{ fill: 'red' }} />
          } >
        </CardHeader>
        <CardContent sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}>
          <Box sx={{ padding: '1rem' }}>
            {connected 
                ? <SignalWifiStatusbar4BarIcon sx={{ fill: '#21ff15', fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon sx={{ fill: 'red', fontSize: '8rem' }} />}
          </Box>

          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>
            {/* For variant="text", adjust the height via font-size */}
            {host 
              ? <Typography>Layout: {layoutId}</Typography>
              : <Skeleton variant="text" sx={{ fontSize: '1rem' }} />}

          </Stack>
        </CardContent>
        <CardActions>
          <Button onClick={() => setConfigOpen(true)} variant="outlined">Select</Button>
        </CardActions>
        
      </Card>

      <LayoutDialog
        onClose={() => setConfigOpen(false)} 
        open={configOpen}
      />
    </>
  );
}

export default Host;
