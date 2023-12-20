import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CallSplit from '@mui/icons-material/CallSplit';

import { HostDialog } from './HostDialog';

export const LayoutApi = props => {

  const { connection } = props;
  const [configOpen, setConfigOpen] = useState(false);
  
  return (
    <>
      <Box className="connection">
        <Box sx={{ padding: '1rem', display: 'flex', flex: '1' }}>
          <Typography variant="h2" sx={{ fontSize: '2rem' }}>
            LayoutApi
          </Typography>
          {/* <pre>
            {JSON.stringify(connection)}*
          </pre> */}
          <Chip
            variant="outlined"
            icon={<CallSplit sx={{
              fill: connection.connected ? '#21ff15' : 'red',
            }} />}
            label={connection.host}
            size="large"
            color="default"
            onClick={() => setConfigOpen(true)}
          ></Chip>
          <Button onClick={() => setConfigOpen(true)} variant="outlined">Edit</Button>
          
        </Box>
        <Box className="connection__status"
          sx={{
            backgroundColor: connection.connected ? '#21ff15' : 'red',
          }}>
          <span>{connection.connected ? 'yes' : 'no'}</span>
        </Box>
        
      </Box>

      <HostDialog
        onClose={() => setConfigOpen(false)} 
        open={configOpen}
      />
    </>
  );
}

export default LayoutApi;
