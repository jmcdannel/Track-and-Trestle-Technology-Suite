import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { useMqtt } from '../Core/Com/MqttProvider'
import { useConnectionStore } from '../Store/useConnectionStore';

export const ActionDeviceDialog = ({ onClose, open, device }) => {

  const updateActionDevice = useConnectionStore(state => state.updateActionDevice);
  const layoutId = useConnectionStore(state => state.layoutId);
  const ports = useConnectionStore(state => state.ports);
  const { publish, isConnected } = useMqtt();
  const [newPort, setNewPort] = useState(null);

  useEffect(() => {
    function requestPorts() {
      console.log('[ActionDeviceDialog] requestPorts', isConnected, open);
      publish(`@ttt/dispatcher/${layoutId}`, JSON.stringify({ action: 'listPorts', payload: {} }));
    }
    open && isConnected && requestPorts()

  }, [open, isConnected]);

  const handleUpdate = async () => {
    console.log('[ActionDeviceDialog] handleUpdate', device, newPort);
    updateActionDevice({ ...device, ...{ port: newPort }});
    onClose()
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle> Action Serial Connection </DialogTitle>
      <pre>mqqt: {isConnected.toString()}</pre>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="device-port"
          freeSolo
          options={ports}
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
