import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import StatusMonitor from '../Connections/StatusMonitor';
import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import { Host } from './Host';
import { HostDialog } from './HostDialog';
import { CmdExDialog } from './CmdExDialog';
import { UsbDialog } from './UsbDialog';

import './Connections.scss';

export const Settings = () => {
  
  const [hostType, setHostType] = useState('EX-JS-API');
  const [hostConnected, setHostConnected] = useState(false);
  const [layoutId, setLayoutId] = useState(api.config.getLayoutId() || '');
  const [state, dispatch] = useContext(Context);
  const { layout, connections } = state;

  useEffect(() => {
    console.log('connections updated, layoutId updated', layoutId, connections);
    // setLayoutApiConnection(connections?.get('layoutApi') || null);
  }, [layoutId, connections]);

  return (
    <>
      <Box className="connections">
        <Host />
      </Box>
      <StatusMonitor apiReady={true} />

      {Array.from(connections.entries()).map(([key, value]) => {
        return (
          <div key={key}>
            {key}
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
      })}
      <h3>LAYOUT</h3>
      <pre>{JSON.stringify(layout, null, 2)}</pre>
    </>
  );
}

export default Settings;
