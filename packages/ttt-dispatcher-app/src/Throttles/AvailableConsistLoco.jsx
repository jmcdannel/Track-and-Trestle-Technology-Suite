import React from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import SteamLocoSvg from '../Shared/Images/locos/steam-icon.svg?react';
import DieselLocoSvg from '../Shared/Images/locos/diesel-icon.svg?react';

import { useLayoutRoadnames } from '../Shared/Hooks/useLayoutRoadnames';

const limitString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.slice(0, maxLength);
  }
};

const AvailableConsistLoco = ({ loco, disabled, onAddLoco }) => {
  const [roadname] = useLayoutRoadnames(loco?.meta?.roadname);

  const handleLeftCLick = () => {
    onAddLoco(loco.address)
  }

  const handleRightCLick = () => {
    onAddLoco(-loco.address)
  }

  return (
    <Paper className={`available-loco ${roadname?.toLowerCase()}`}>
      {/* <Chip className="throttle-nameplate" label={limitString(name, 4)} size="small" variant="outlined"></Chip>             */}
      <Grid container spacing={1} alignItems="center" padding={1}>
        <Grid item xs={4}>
          <Chip disabled={disabled} className="throttle-nameplate" label={limitString(loco.name, 4)} size="small" variant="outlined"></Chip>            
        </Grid>
        <Grid item xs={4}>
          <Button disabled={disabled} variant="outlined" startIcon={<AddIcon />} onClick={handleLeftCLick}>
            <DieselLocoSvg className="consist-loco consist-loco--left" />
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button disabled={disabled} variant="outlined" startIcon={<AddIcon />} onClick={handleRightCLick}>
            <DieselLocoSvg className="consist-loco consist-loco--right" />
          </Button>
        </Grid>
      </Grid>            
    </Paper>
  );
};

export default AvailableConsistLoco;