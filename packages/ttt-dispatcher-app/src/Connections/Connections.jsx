import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton'

import { useLayoutStore } from '../Store/useLayoutStore';
import { Host } from './Host';
import { Dcc } from './Dcc';
import { Actions } from './Actions';

import './Connections.scss';


export const Settings = () => {
  
  const layout = useLayoutStore(state => state.layout);

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
