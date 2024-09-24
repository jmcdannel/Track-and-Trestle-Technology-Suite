import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useLocoStore } from '../Store/useLocoStore';
import { useThrottleStore } from '../Store/useThrottleStore';

import NamePlate from '../Shared/components/NamePlate';

export const ConsistTrim = ({ loco, consist = [] }) => {
  const locos = useLocoStore(state => state.locos);
  const upsertThrottle = useThrottleStore(state => state.upsertThrottle);

  const btnStlye = {
    padding: {
      xs: '0.25rem 1rem'
    },
    flexDirection: 'row'
  }

  function handleDownClick(cloco) {
    const newConsist = [...consist];
    newConsist.find(c => c.address === cloco.address).trim -= 1;
    console.log('down', newConsist);
    upsertThrottle({ address: cloco.address, consist: newConsist });
  }

  function handleUpClick(cloco) {
    const newConsist = [...consist];
    newConsist.find(c => c.address === cloco.address).trim += 1;
    console.log('up', cloco, newConsist);
    upsertThrottle({ address: cloco.address, consist: newConsist });
  }

  return (
    <Box>
      {/* <pre>{JSON.stringify(consist, null, 2)}</pre> */}
      {consist && consist.length > 0 && consist.map((cloco, idx) => (
        <Box key={cloco.address}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: '1',
            position: 'relative',
            margin: '0 0 .5rem 0',
          }}
          className="speed-control"
        >
          <NamePlate
            name={locos.find(l => l.address === cloco.address)?.name}
            size="small"
            sx={{
              fontSize: '0.5rem',
            }}
            onClick={() => { }}
          />
          <ButtonGroup
            sx={{
              position: 'relative',
              zIndex: 2,
            }}
            orientation="horizontal"
            size="small"
            aria-label="outlined primary button group"
            className="rounded-button-group rounded-button-group--vertical rounded-button-group--small throttle__consist-trim__controls__group disable-dbl-tap-zoom"
          >
            <IconButton
              className="speed-up-btn disable-dbl-tap-zoom"
              style={btnStlye}
              onClick={() => handleUpClick(cloco)}>
              <AddIcon />
            </IconButton>
            <IconButton
              className="speed-down-btn disable-dbl-tap-zoom"
              style={btnStlye}
              onClick={() => handleDownClick(cloco)}>
              <RemoveIcon />
            </IconButton>
          </ButtonGroup>
          <Box
            sx={{
              background: 'linear-gradient(140deg, rgb(235, 91, 71) 0%, rgba(187, 62, 46, 0.8) 100%)',
              padding: '.25rem  1rem .25rem 1.5rem',
              color: '#fff',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1.5rem',
              position: 'relative',
              left: '-1rem',
              zIndex: 1,
              border: '0px solid rgba(255, 255, 255, 0.5)',
            }}
            className="speed-control"
          >
            {cloco.trim}
          </Box>
        </Box >
      ))}
    </Box>
  );
}

export default ConsistTrim;