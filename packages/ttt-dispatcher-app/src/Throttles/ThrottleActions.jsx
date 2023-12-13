import React, { useContext, useState}  from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import SettingsIcon from '@mui/icons-material/Settings';
import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

import { Context } from '../Store/Store';

const ThrottleActions = (props) => {

  const { onShowSettings, onShowFunctions, onStop, cruiseDisabled } = props;
  const address = Number(props.loco.address);

  const [ , dispatch ] = useContext(Context);

  const handleShowFunctionClick = () => {
    onShowFunctions();
  }

  const handleShowSettingsClick = () => {
    onShowSettings();
  }

  const handleCruiceControlClick = async () => {
    try {
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, cruiseControl: true } });
    } catch (err) {
      console.error(err);
    }
  }

  const handleParkClick = async () => {
    try {
      onStop();
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, cruiseControl: false } });
    } catch (err) {
      console.error(err);
    }    
  }

  return (
    <Paper elevation={3} className="" display="flex" direction="column" square>
      <ButtonGroup
        orientation="vertical"
        size="small"
        aria-label="vertical outlined primary button group"
      >
        <Button
          className="width100 textLeft"
          label="Settings"
          variant="outlined"
          onClick={handleShowSettingsClick}
          startIcon={<SettingsIcon />}>
          Settings
        </Button>
        <Button
          className="width100 textLeft"
          label="Functions"
          variant="outlined"
          onClick={handleShowFunctionClick}
          startIcon={<TrainIcon />}>
          Functions
        </Button>

        <Button
          className="width100 textLeft"
          disabled={cruiseDisabled}
          label="Cruise Control"
          variant="outlined"
          onClick={handleCruiceControlClick}
          startIcon={<SpeedIcon />}>
          Cruise
        </Button>

        <Button
          className="width100 textLeft"
          onClick={handleParkClick}
          label="Park"
          variant="outlined"
          startIcon={<LocalParkingIcon />}>
          Park
        </Button>
      </ButtonGroup>
    </Paper>
  );
};

export default ThrottleActions;
