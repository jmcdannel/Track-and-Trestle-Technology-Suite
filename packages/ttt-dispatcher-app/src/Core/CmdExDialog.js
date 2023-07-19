import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { Context } from '../Store/Store';
import api from '../Api';

export const CmdExDialog = ({ onClose, open, currentPort, cmdExInterface }) => {


  const [ state, ] = useContext(Context);
  const { ports } = state;

  const [usbPort, setUsbPort] = useState(currentPort ? currentPort : '');
  const [portList, setPortList] = useState(currentPort ? [currentPort] : []);

  useEffect(async () => {
    ports && ports.length && setPortList(portList => [...ports, ...portList])
  }, [ports]);

  useEffect(async () => {
    open && await api.ports.get();
  }, [open]);
  

  const handleUpdate = async () => {
    console.log('handleUpdate');
    await api.interfaces.put({
      id: cmdExInterface.id,
      serial: usbPort
    });
    // window.location.reload(false);
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
            options={portList}
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
