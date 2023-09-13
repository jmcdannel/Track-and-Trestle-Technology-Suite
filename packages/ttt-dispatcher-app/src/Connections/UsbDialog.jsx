import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { Context } from '../Store/Store';
import api from '../Shared/api/api';

export const UsbDialog = ({ onClose, open, currentPort }) => {


  const [ state, ] = useContext(Context);
  const { connections } = state;
  const actionApiConn = connections.get('action-api');


  const [usbConnection, setUsbconnection] = useState(null);
  const [ports, setPorts] = useState([]);
  const [usbPort, setUsbPort] = useState(currentPort ? currentPort : '');

  useEffect(async () => {
    console.log('[UsbDialog] ports', ports, connections, actionApiConn);

    console.log('[UsbDialog] actionApiConn', actionApiConn);
    actionApiConn?.ports && setPorts(actionApiConn.ports);
  }, [connections, actionApiConn, ports]);

  useEffect(async () => {
    console.log('[UsbDialog] usbConnection', usbConnection, connections);
    if (usbConnection) { return; }

    const usbConn = connections.get('betatrack-io');
    console.log('[UsbDialog] usbConn', usbConn);
    usbConn && setUsbconnection(usbConn);

  }, [connections, usbConnection]);

  useEffect(async () => {
    open && await api.actionApi.put('ports', { });
  }, [open]);
  

  const handleUpdate = async () => {
    console.log('[UsbDialog] handleUpdate', usbPort);
    await api.config.set('betatrack-io', usbPort);
    await api.actionApi.put('serialConnect', { connectionId: 'betatrack-io', serial: usbPort });
    // window.location.reload(false);
    onClose();
  }

  const getPortList = () => {
    const conn = connections.get('action-api');
    if (conn && conn.ports) {
      return conn.ports;
    } else {
      return [];
    }
  }

  return (
    <Dialog onClose={onClose} open={open}>
        <DialogTitle>USB Serial Port</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="cmd-ex-port"
            freeSolo
            options={getPortList()}
            value={usbPort}
            onChange={(event, newValue) => setUsbPort(newValue)}
            renderInput={(params) => <TextField {...params} label="USB Serial Port" />}
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

export default UsbDialog;
