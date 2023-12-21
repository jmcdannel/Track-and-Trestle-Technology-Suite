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

import { HostDialog } from './HostDialog';
import useConnectionStore from '../Store/useConnectionStore';

export const Host = props => {

  const { connection } = props;
  const [configOpen, setConfigOpen] = useState(false);
  const host = useConnectionStore(state => state.host);
  
  return (
    <>
      <Card className="connection">
        <CardHeader 
          title="Host" 
          avatar={
            connection?.connected 
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
            {connection?.connected 
                ? <SignalWifiStatusbar4BarIcon sx={{ fill: '#21ff15', fontSize: '8rem' }} />
                : <SignalWifiStatusbarNullIcon sx={{ fill: 'red', fontSize: '8rem' }} />}
          </Box>

          <Stack spacing={1} sx={{ padding: '1rem', flex: '1' }}>
            {/* For variant="text", adjust the height via font-size */}
            {host 
              ? <Typography>Host: {host}</Typography>
              : <Skeleton variant="text" sx={{ fontSize: '1rem' }} />}

            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" height={20} />
            <Skeleton variant="rectangular" height={20} />
            <Skeleton variant="rectangular" height={20} />
          </Stack>
          {/* <pre>
            {JSON.stringify(connection)}*
          </pre> */}
          {/* <Chip
            variant="outlined"
            icon={<CallSplit sx={{
              fill: connection?.connected ? '#21ff15' : 'red',
            }} />}
            label={connection?.host}
            size="large"
            color="default"
            onClick={() => setConfigOpen(true)}
          ></Chip> */}
          
          {/* <Box className="connection__status"
            sx={{
              backgroundColor: connection?.connected ? '#21ff15' : 'red',
            }}>
            <span>{connection?.connected ? 'yes' : 'no'}</span>
          </Box> */}
        </CardContent>
        <CardActions>
          <Button onClick={() => setConfigOpen(true)} variant="outlined">Connect</Button>
        </CardActions>
        
      </Card>

      <HostDialog
        onClose={() => setConfigOpen(false)} 
        open={configOpen}
      />
    </>
  );
}

export default Host;
