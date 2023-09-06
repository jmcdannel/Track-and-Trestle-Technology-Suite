import React, { useContext, useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import CallSplit from '@mui/icons-material/CallSplit';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from '@mui/material/Autocomplete';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import MapIcon from '@mui/icons-material/Map';
import IconButton from '@mui/material/IconButton';
import UsbIcon from '@mui/icons-material/Usb';
import UsbOffIcon from '@mui/icons-material/UsbOff';
import Tooltip from '@mui/material/Tooltip';
// import { jmriHosts, apiHosts, layoutIds, updateConfig } from '../config/config';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import { CmdExDialog } from './CmdExDialog';
import { UsbDialog } from './UsbDialog';
import log from '../Shared/utils/logger';

export const apiHosts = [
  'tamarackjunctionmbp.local',
  'joshs-mac-mini.local',
  'localhost',
  '127.0.0.1'
];

export const layoutIds = [
  'tam',
  'betatrack'
];

export const StatusMonitor = ({ jmriReady,  apiReady }) => {

  const [ state, dispatch ] = useContext(Context);
  const { layout, connections } = state;
  console.log('[StatusMonitor]', layout, connections,  connections?.get('layoutApi')?.connected);

  const [apiConfigOpen, setAPIConfigOpen] = useState(false);
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);
  const [cmdExConfigOpen, setCmdExConfigOpen] = useState(false);
  const [usbConfigOpen, setUsbConfigOpen] = useState(false);

  const [apiHost, setAPIHost] = useState(api.config.getHost());
  const [layoutId, setLayoutId] = useState(api.config.getLayoutId());

  const handleAPIUpdate = async () => {
    await api.config.setHost(apiHost);
    window.location.reload(false);
  }

  const handleLayoutUpdate = async () => {
    await api.config.selectLayout(layoutId);
    window.location.reload(false);
  }

  const apiClassName = `status-monitor--${
    connections?.get('layoutApi')?.connected
      ? 'connected'
      : 'unknown'
    }`;

  const layoutIdClassName = `status-monitor--${
    layoutId
      ? 'connected'
      : 'unknown'
    }`;

  const cmdExClassName = `status-monitor--${
    connections?.get('dcc-js-api')?.connected
      ? 'connected'
      :  'unknown'
    }`;

  const usbClassName = `status-monitor--${
    connections?.get('betatrack-io')?.connected
      ? 'connected'
      :'unknown'
    }`;

  function getStatusClassName(connected) {
    return  `status-monitor--${connected ? 'connected' : 'unknown'}`;
  }

  // TODO: handle api error

  return (
    <div className="status-monitor">
      <Tooltip title={`${apiHost}`}>
        <Chip
          className={`status-monitor__api ${apiClassName}`}
          variant="outlined"
          icon={<CallSplit />}
          label="API"
          size="small"
          color="default"
          onClick={() => setAPIConfigOpen(true)}
        />
      </Tooltip>
      <Tooltip title="Layout ID">
        <Chip
          className={`status-monitor__layout ${layoutIdClassName}`}
          variant="outlined"
          icon={<MapIcon />}
          label={`Layout ID: ${layoutId}`}
          color="default"
          size="small"
          onClick={() => setLayoutConfigOpen(true)}
        />
      </Tooltip>
      {/* <Tooltip title="JMRI Connection Status">
        <Chip
          className={`status-monitor__jmri ${jmriClassName}`}
          variant="outlined"
          icon={<UnfoldMoreIcon />}
          label="JMRI"
          size="small"
          color="default"
          onClick={() => setJMRIConfigOpen(true)}
        />
      </Tooltip> */}
      <Tooltip title="CMD-EX">
        <Chip
          className={`status-monitor__cmd-ex ${cmdExClassName}`}
          variant="outlined"
          icon={connections.get('dcc-js-api') ? (<UsbIcon />) : (<UsbOffIcon />)}
          label="CMD-EX"
          size="small"
          color="default"
          onClick={() => setCmdExConfigOpen(true)}
        />
      </Tooltip>
      <Tooltip title="Action API">
        <Chip
          className={`status-monitor__usb ${getStatusClassName(connections.get('action-api')?.connected)}`}
          variant="outlined"
          icon={connections.get('action-api') ? (<UsbIcon />) : (<UsbOffIcon />)}
          label="Action API"
          size="small"
          color="default"
          onClick={() => setUsbConfigOpen(true)}
        />
      </Tooltip>

      <Tooltip title="USB">
        <Chip
          className={`status-monitor__usb ${usbClassName}`}
          variant="outlined"
          icon={connections.get('betatrack-io') ? (<UsbIcon />) : (<UsbOffIcon />)}
          label="USB"
          size="small"
          color="default"
          onClick={() => setUsbConfigOpen(true)}
        />
      </Tooltip>
    <CmdExDialog 
        onClose={() => setCmdExConfigOpen(false)} 
        open={cmdExConfigOpen}
      />

      <UsbDialog
        onClose={() => setUsbConfigOpen(false)} 
        open={usbConfigOpen}
      />

    {/* <CmdExDialog 
      onClose={() => setCmdExConfigOpen(false)} 
      open={cmdExConfigOpen}
      currentPort={cmdExInterface?.serial}
      cmdExInterface={cmdExInterface}
    /> */}

      <Dialog onClose={() => setLayoutConfigOpen(false)} open={layoutConfigOpen}>
        <DialogTitle>Layout ID</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="layout-id"
            freeSolo
            options={layoutIds}
            value={layoutId}
            renderInput={(params) => <TextField {...params} label="Layout ID" />}
          />
          <IconButton 
            size="large" 
            onClick={handleLayoutUpdate}>
              <SaveIcon />
          </IconButton>
      </Dialog>

      <Dialog onClose={() => setAPIConfigOpen(false)} open={apiConfigOpen}>
        <DialogTitle>API Host</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="api-host"
            freeSolo
            options={apiHosts}
            value={apiHost}
            renderInput={(params) => <TextField {...params} label="API Host" />}
          />
          <IconButton 
            size="large" 
            onClick={handleAPIUpdate}>
              <SaveIcon />
          </IconButton>
      </Dialog>

      {/* <Dialog onClose={() => setJMRIConfigOpen(false)} open={jmriConfigOpen}>
        <DialogTitle>JMRI Host</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="jmri-host"
            freeSolo
            onChange={(event, newValue) => {
              setJMRIHost(newValue);
            }}
            options={jmriHosts}
            value={jmriHost}
            renderInput={(params) => <TextField {...params} label="JMRI Host" />}
          />
          <IconButton 
            size="large" 
            onClick={handleJMRIUpdate}>
              <SaveIcon />
          </IconButton>
      </Dialog> */}
    </div>
  );
}

export default StatusMonitor;