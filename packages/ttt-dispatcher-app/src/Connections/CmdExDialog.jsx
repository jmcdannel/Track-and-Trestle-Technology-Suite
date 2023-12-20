import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { Context } from '../Store/Store';
import api from '../Shared/api/api';

export const CmdExDialog = ({ onClose, open, currentPort, cmdExInterface }) => {

  const [ state, ] = useContext(Context);
  const { connections } = state;
  const [usbPort, setUsbPort] = useState(currentPort ? currentPort : '');

  useEffect(async () => {
    open && await api.dcc.send('listPorts', { });
  }, [open]);
  

  const handleUpdate = async () => {
    const serial = usbPort;
    await api.config.set('dcc-js-api', serial);
    await api.dcc.send('connect', { serial });
    window.location.reload(false);
  }

  const getPortList = () => {
    const conn = connections.get('dcc-js-api');
    if (conn && conn.ports) {
      return conn.ports;
    } else {
      return [];
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
        <DialogTitle>CMD-EX Port</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="cmd-ex-port"
            freeSolo
            onInputChange={(event, newValue) => {
              setUsbPort(newValue);
            }}
            onChange={(event, newValue) => {
              setUsbPort(newValue);
            }}
            options={getPortList()}
            value={usbPort}
            renderInput={(params) => <TextField {...params} label="CMD-EX Port" />}
          />
          <Button 
            size="large" 
            startIcon={<SaveIcon />}
            onClick={handleUpdate}>
              Save              
          </Button>
          <span>{currentPort}</span>
      </Dialog>
  )

}

export default CmdExDialog;
