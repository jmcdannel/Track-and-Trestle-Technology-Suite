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
import { getAppConfig, jmriHosts, apiHosts, layoutIds, updateConfig } from '../config/config';
import { Context } from '../Store/Store';
import { CmdExDialog } from './CmdExDialog';
import log from '../Shared/utils/logger';

const JMRI_TIMEOUT_MS = 3000;
const API_TIMEOUT_MS = 5000;
const CMDEX_TIMEOUT_MS = 5000;
const USB_TIMEOUT_MS = 5000;

export const StatusMonitor = ({ jmriReady,  apiReady }) => {

  const appConfig = getAppConfig();

  const [ state, dispatch ] = useContext(Context);
  const { layout } = state;
  const cmdExInterface = layout?.interfaces?.find(i => i.type === 'cmd-ex');
  const cmdUsbInterfaces = layout?.interfaces?.filter(i => i.type === 'serial') || [];
  const cmdExReady = cmdExInterface?.status === 'connected';
  const usbReady = cmdUsbInterfaces.every(i => i.status === 'connected');

  log.debug('cmdExInterface', cmdExInterface, layout);

  const [jmriConfigOpen, setJMRIConfigOpen] = useState(false);
  const [apiConfigOpen, setAPIConfigOpen] = useState(false);
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);
  const [cmdExConfigOpen, setCmdExConfigOpen] = useState(false);

  const [jmriHost, setJMRIHost] = useState(appConfig.jmri);
  const [apiHost, setAPIHost] = useState(appConfig.api);
  const [layoutId, setLayoutId] = useState(appConfig.layoutId);

  const [jmriTimeout, setJmriTimeout] = useState(false);
  const [apiTimeout, setApiTimeout] = useState(false);
  const [cmdExTimeout, setCmdExTimeout] = useState(false);
  const [usbTimeout, setUsbTimeout] = useState(false);

  useEffect(() => {
    const jmriTimer = setTimeout(() => {
      setJmriTimeout(true);
    }, JMRI_TIMEOUT_MS);
    const apiTimer = setTimeout(() => {
      setApiTimeout(true);
    }, API_TIMEOUT_MS);
    const cmdExTimer = setTimeout(() => {
      setCmdExTimeout(true);
    }, CMDEX_TIMEOUT_MS);
    const usbTimer = setTimeout(() => {
      setUsbTimeout(true);
    }, USB_TIMEOUT_MS);

    return () => {
      clearTimeout(jmriTimer);
      clearTimeout(apiTimer);
      clearTimeout(cmdExTimer);
      clearTimeout(usbTimer);
    }
  }, []);

  const handleJMRIUpdate = () => {
    appConfig.jmri = jmriHost;
    updateConfig(appConfig);
    window.location.reload(false);
  }

  const handleAPIUpdate = () => {
    appConfig.api = apiHost;
    updateConfig(appConfig);
    window.location.reload(false);
  }

  const handleLayoutUpdate = () => {
    appConfig.layoutId = layoutId;
    updateConfig(appConfig);
    window.location.reload(false);
  }

  const hasJmri = !!appConfig.jmri;
  const hasApi = !!appConfig.api;

  const jmriClassName = `status-monitor--${
    hasJmri && jmriReady
      ? 'connected'
      : jmriTimeout ? 'timeout' : 'unknown'
    }`;

  const apiClassName = `status-monitor--${
    hasApi && apiReady
      ? 'connected'
      : apiTimeout ? 'timeout' : 'unknown'
    }`;

  const cmdExClassName = `status-monitor--${
    apiReady && cmdExReady
      ? 'connected'
      : cmdExTimeout ? 'timeout' : 'unknown'
    }`;

  const usbClassName = `status-monitor--${
    apiReady && usbReady
      ? 'connected'
      : usbTimeout ? 'timeout' : 'unknown'
    }`;

  // TODO: handle jmlri disconnected
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
          className={`status-monitor__layout ${apiClassName}`}
          variant="outlined"
          icon={<MapIcon />}
          label={`Layout ID: ${appConfig.layoutId}`}
          color="default"
          size="small"
          onClick={() => {}}
        />
      </Tooltip>
      <Tooltip title="JMRI Connection Status">
        <Chip
          className={`status-monitor__jmri ${jmriClassName}`}
          variant="outlined"
          icon={<UnfoldMoreIcon />}
          label="JMRI"
          size="small"
          color="default"
          onClick={() => setJMRIConfigOpen(true)}
        />
      </Tooltip>
      <Tooltip title="CMD-EX Status">
        <Chip
          className={`status-monitor__cmd-ex ${cmdExClassName}`}
          variant="outlined"
          icon={cmdExReady ? (<UsbIcon />) : (<UsbOffIcon />)}
          label="CMD-EX"
          size="small"
          color="default"
          onClick={() => setCmdExConfigOpen(true)}
        />
      </Tooltip>
      <Tooltip title="USB">
        <Chip
          className={`status-monitor__usb ${usbClassName}`}
          variant="outlined"
          icon={usbReady ? (<UsbIcon />) : (<UsbOffIcon />)}
          label="USB"
          size="small"
          color="default"
          onClick={() => {}}
        />
      </Tooltip>

      {cmdExInterface && (
        <CmdExDialog 
          onClose={() => setCmdExConfigOpen(false)} 
          open={cmdExConfigOpen}
          currentPort={cmdExInterface?.serial}
          cmdExInterface={cmdExInterface}
        />
      )}

      <Dialog onClose={() => setLayoutConfigOpen(false)} open={layoutConfigOpen}>
        <DialogTitle>Layout ID</DialogTitle>
        <Autocomplete
            sx={{ padding: '1rem', width: '360px' }}
            id="layout-id"
            freeSolo
            onChange={(event, newValue) => {
              setLayoutId(newValue);
            }}
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
            onInputChange={(event, newValue) => {
              setAPIHost(newValue);
            }}
            onChange={(event, newValue) => {
              setAPIHost(newValue);
            }}
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

      <Dialog onClose={() => setJMRIConfigOpen(false)} open={jmriConfigOpen}>
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
      </Dialog>
    </div>
  );
}

export default StatusMonitor;