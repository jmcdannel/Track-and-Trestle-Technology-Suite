import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useDcc } from './useDcc'
import { useDccStore } from '../Store/useDccStore';

const RESET_COMMAND = 'D RESET';
const CURRENT_COMMAND = 'JI';
const REQUEST_STATUS_COMMAND = 's';

export const DccCommand = () => {

  const appendtoDccLog = useDccStore(state => state.appendtoLog);
  const { send } = useDcc()
  const [cmd, setCmd ] = useState('');
  const [resetClicked, setResetClicked ] = useState(false);
  const [requestStatusClicked, setRequestStatusClicked ] = useState(false);

  async function sendDccCommand() {
    await send('dcc', cmd )
    appendtoDccLog(cmd)
    setCmd('')
  }

  async function handleResetClick() {
    setResetClicked(true);
    await send('dcc', RESET_COMMAND);
  }

  async function handleCurrentClick() {
    await send('dcc', CURRENT_COMMAND);
  }

  async function handleRequestStatusClick() {
    setRequestStatusClicked(true);
    await send('dcc', REQUEST_STATUS_COMMAND);
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
        onKeyUp={e => e.key === 'Enter' && sendDccCommand()}
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
          Status
      </Button>
      <Button 
        variant="outlined" 
        color="info" 
        disabled
        onClick={handleCurrentClick} 
        sx={{ whiteSpace: 'nowrap' }}
        >
          Current
      </Button>
    </Box>
  );
};

export default DccCommand;
