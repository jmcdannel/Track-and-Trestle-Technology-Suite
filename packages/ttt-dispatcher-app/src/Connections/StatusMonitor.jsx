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
import { HostDialog } from './HostDialog';
import { LayoutDialog } from './LayoutDialog';
import { CmdExDialog } from './CmdExDialog';
import { UsbDialog } from './UsbDialog';
import log from '../Shared/utils/logger';


export const StatusMonitor = ({ jmriReady,  apiReady }) => {

  const [ state, dispatch ] = useContext(Context);
  const { layout, connections } = state;

  const [apiConfigOpen, setAPIConfigOpen] = useState(false);
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);
  const [cmdExConfigOpen, setCmdExConfigOpen] = useState(false);
  const [usbConfigOpen, setUsbConfigOpen] = useState(false);

  const [layoutApiConnection, setLayoutApiConnection] = useState(connections?.get('layoutApi') || null);
  const [layoutIdConnection, setLayoutIdConnection] = useState(connections?.get('layoutApi') || null);

  const [layoutId, setLayoutId] = useState(api.config.getLayoutId() || '');

  const apiClassName = `status-monitor--${
    layoutApiConnection?.connected
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

  useEffect(() => {
    console.log('connections updated, layoutId updated', layoutId, connections);
    setLayoutApiConnection(connections?.get('layoutApi') || null);
  }, [layoutId, connections]);

  return (
    <div className="status-monitor">
      <Tooltip title="HOST">
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

      <HostDialog 
        onClose={() => setAPIConfigOpen(false)} 
        open={apiConfigOpen}
      />

      <LayoutDialog
        onClose={() => setLayoutConfigOpen(false)} 
        open={layoutConfigOpen}
      />

    </div>
  );
}

export default StatusMonitor;