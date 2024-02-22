import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CallSplit from '@mui/icons-material/CallSplit';
import Skeleton from '@mui/material/Skeleton';

import api from '../Shared/api/api';
import { Context } from '../Store/Store';
import { Host } from './Host';
import { Dcc } from './Dcc';
import { Actions } from './Actions';

import './Connections.scss';


export const Settings = () => {
  
  const [hostType, setHostType] = useState('EX-JS-API');
  const [hostConnected, setHostConnected] = useState(false);
  const [layoutId, setLayoutId] = useState(api.config.getLayoutId() || '');
  const [state, dispatch] = useContext(Context);
  const { layout, connections } = state;

  // useEffect(() => {
  //   console.log('connections updated, layoutId updated', layoutId, connections);
  //   // setLayoutApiConnection(connections?.get('layoutApi') || null);
  // }, [layoutId, connections]);

  const renderConnection = (connection, idx) => {
    switch (connection.type) {
      case 'dcc-js-api' :
        return <Dcc key={connection.id} />;
      case 'action-api' : 
        return <Actions key={connection.id} />
        break;
      case 'dcc-ex' :      
      case 'serial' :
        // no-op
        break;
      default:
        return <Typography key={`conn${idx}`} variant="h6">{connection.id} - {connection.type}</Typography>
        break;
    }    
  }

  return (
    <>
      <Box className="connections">
        <Host />
        {layout && layout.interfaces && layout.interfaces.length > 0
          ? layout.interfaces.map(renderConnection)
          : <>
              <Skeleton variant="rectangular" height={20} />
              <Skeleton variant="rectangular" height={20} />
              <Skeleton variant="rectangular" height={20} />
            </> 
        }
      </Box>
{/* 
      {Array.from(connections.entries()).map(([key, value]) => {
        return (
          <div key={key}>
            {key}
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
      })} */}
      <h3>LAYOUT</h3>
      <Box component="pre" sx={{ textAlign: 'left', fontSize: '10px' }}>{JSON.stringify(layout, null, 2)}</Box>
    </>
  );
}

export default Settings;
