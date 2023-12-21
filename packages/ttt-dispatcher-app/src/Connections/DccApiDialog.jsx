import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
// import api from '../Shared/api/api';

import useConnectionStore from '../Store/useConnectionStore';

export const apiHosts = [
  'tamarackjunctionmbp.local',
  'joshs-mac-mini.local',
  'tttpi.local',
  'localhost',
  '127.0.0.1'
];

export const DccApiDialog = ({ onClose, open }) => {

  const dccHost = useConnectionStore(state => state.dccHost);
  const setDccHost = useConnectionStore(state => state.setDccHost);
  const [newDccHost, setNewDccHost] = useState(dccHost);
  const ports = [];

  // useEffect(async () => {
  //   open && await api.dcc.send('listPorts', { });
  // }, [open]);

  const handleUpdate = async () => {
    await setDccHost(newDccHost);
    onClose()
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>DCC-EX Serial Connection</DialogTitle>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="dcc-host"
          freeSolo
          options={apiHosts}
          value={dccHost}
          onInputChange={(event, newValue) => {
            setNewDccHost(newValue);
          }}
          onChange={(event, newValue) => {
            setNewDccHost(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="DCC API Host" />}
        />
        <Button 
          size="large" 
          startIcon={<SaveIcon />}
          onClick={handleUpdate}>
            Save              
        </Button>
      </Dialog>
  )
}

export default DccApiDialog;
