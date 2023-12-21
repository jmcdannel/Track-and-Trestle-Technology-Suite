import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import api from '../Shared/api/api';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const DccDeviceDialog = ({ onClose, open }) => {

  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const setDccDevice = useConnectionStore(state => state.setDccDevice);
  const dccPorts = useConnectionStore(state => state.dccPorts);
  const [newDccDevice, setNewDccDevice] = useState(null);

  useEffect(async () => {
    console.log('[DccDeviceDialog] dccApiStatus (listPorts)', open, dccApiStatus);
    open && dccApiStatus === CONNECTION_STATUS.CONNECTED && await api.dcc.send('listPorts', { });
  }, [open, dccApiStatus]);

  const handleUpdate = async () => {
    console.log('[DccDeviceDialog] handleUpdate', newDccDevice);
    setDccDevice(newDccDevice);
    onClose()
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle> DCC-EX Serial Connection </DialogTitle>
      <pre>dccApiStatus: {dccApiStatus}</pre>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="dcc-deviced"
          freeSolo
          options={dccPorts}
          value={newDccDevice}
          onInputChange={(event, newValue) => {
            setNewDccDevice(newValue);
          }}
          onChange={(event, newValue) => {
            setNewDccDevice(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="DCC Serial Port" />}
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

export default DccDeviceDialog;
