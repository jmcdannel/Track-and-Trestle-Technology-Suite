import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import api from '../Shared/api/api';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const ActionDeviceDialog = ({ onClose, open, device }) => {

  const actionApiStatus = useConnectionStore(state => state.actionApiStatus);
  const updateActionDevice = useConnectionStore(state => state.updateActionDevice);
  const actionPorts = useConnectionStore(state => state.actionPorts);
  const [newPort, setNewPort] = useState(null);

  useEffect(async () => {
    open && actionApiStatus === CONNECTION_STATUS.CONNECTED && await api.actionApi.fetchPorts();
  }, [open, actionApiStatus]);

  const handleUpdate = async () => {
    console.log('[ActionDeviceDialog] handleUpdate', device, newPort);
    updateActionDevice({ ...device, ...{ port: newPort }});
    onClose()
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle> Action Serial Connection </DialogTitle>
      <pre>actionApiStatus: {actionApiStatus}</pre>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="device-port"
          freeSolo
          options={actionPorts}
          value={newPort}
          onInputChange={(event, newValue) => {
            setNewPort(newValue);
          }}
          onChange={(event, newValue) => {
            setNewPort(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Serial Port" />}
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

export default ActionDeviceDialog;
