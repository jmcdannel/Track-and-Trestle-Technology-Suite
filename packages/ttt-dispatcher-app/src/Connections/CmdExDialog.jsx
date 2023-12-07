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


  const [dccConnection, setDccconnection] = useState(null);
  const [ports, setPorts] = useState([]);
  const [usbPort, setUsbPort] = useState(currentPort ? currentPort : '');

  // useEffect(async () => {
  //   const dccConn = connections.get('dcc-js-api');
  //   console.log('dccConn', dccConn);
  //   setDccconnection(dccConn);
  //   dccConn?.ports && setPorts(dccConn.ports);
  //   // if (!dccConnection) {
  //   //   setDccconnection(connections.get('dcc-js-api'));
  //   //   console.log('[CmdExDialog]', connections.get('dcc-js-api'));
  //   // }
  // }, [connections, dccConnection, ports]);

  // useEffect(async () => {
  //   dccConnection?.ports && dccConnection.ports.length && setPortList(portList => [...dccConnection.ports, ...portList])
  // }, [dccConnection]);

  useEffect(async () => {
    console.log('listPorts', api.dcc);
    open && await api.dcc.send('listPorts', { });
  }, [open]);
  

  const handleUpdate = async () => {
    const serial = usbPort;
    console.log('handleUpdate', usbPort);
    await api.config.set('dcc-js-api', serial);
    await api.dcc.send('connect', { serial });
    // await api.interfaces.put({
    //   id: cmdExInterface.id,
    //   serial: usbPort
    // });
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
