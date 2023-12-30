import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import api from '../Shared/api/api';

const RESET_COMMAND = 'D RESET';
const REQUEST_STATUS_COMMAND = 's';

export const DccCommand = () => {

  const [cmd, setCmd ] = useState('');
  const [resetClicked, setResetClicked ] = useState(false);
  const [requestStatusClicked, setRequestStatusClicked ] = useState(false);

  async function sendDccCommand() {
    await api.dcc.send('dcc', cmd )
    setCmd('')
  }

  async function handleResetClick() {
    setResetClicked(true);
    await api.dcc.send('dcc', RESET_COMMAND);
  }

  async function handleRequestStatusClick() {
    setRequestStatusClicked(true);
    await api.dcc.send('dcc', REQUEST_STATUS_COMMAND);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem'
      }}
    >
      <TextField 
        label="DCC Command" 
        variant="outlined" 
        fullWidth
        value={cmd}
        onChange={e => setCmd(e.target.value)}
      />
      <Divider orientation="vertical" flexItem className="divider" />
      <Button variant="contained" onClick={sendDccCommand} sx={{ mr: 1 }}>Send</Button>
      <Button 
        variant="outlined" 
        color="warning" 
        onClick={handleResetClick} 
        onAnimationEnd={() => setResetClicked(false)}
        className={resetClicked ? "jello-vertical" : ""}
        sx={{ mr: 1 }}
        >
          Reset
      </Button>
      <Button 
        variant="outlined" 
        color="info" 
        onClick={handleRequestStatusClick} 
        onAnimationEnd={() => setRequestStatusClicked(false)}
        className={requestStatusClicked ? "jello-vertical" : ""}
        sx={{ whiteSpace: 'nowrap' }}
        >
          GET STATUS
      </Button>
    </Box>
  );
};

export default DccCommand;
