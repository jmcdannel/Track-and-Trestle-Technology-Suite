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

export const HostDialog = ({ onClose, open }) => {

  const [apiHost, setAPIHost] = useState(null);
  const setHost = useConnectionStore(state => state.setHost);

  // useEffect(() => {
  //   async function loadHost() {
  //     const host = await api.config.getHost();
  //     setAPIHost(host);
  //   }
  //   loadHost();
  // }, []);

  const handleUpdate = async () => {
    console.log('handleAPIUpdate', apiHost);
    setHost(apiHost);
    // await api.config.setHost(apiHost);
    // window.location.reload(false);
    onClose();
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>TTT Layout API Host</DialogTitle>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="cmd-ex-port"
          freeSolo
          onInputChange={(event, newValue) => {
            setAPIHost(newValue);
          }}
          onChange={(event, newValue) => {
            setAPIHost(newValue);
          }}
          options={apiHosts}
          value={apiHost}
          renderInput={(params) => <TextField {...params} label="HOST" />}
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

export default HostDialog;
