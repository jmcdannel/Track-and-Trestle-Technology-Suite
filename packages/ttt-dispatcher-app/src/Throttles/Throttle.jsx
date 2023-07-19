import React, { useState, useContext, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TrainIcon from '@mui/icons-material/Train';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PanToolIcon from '@mui/icons-material/PanTool';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandIcon from '@mui/icons-material/Expand';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import CompressIcon from '@mui/icons-material/Compress';

import ThrottleSlider from './ThrottleSlider';
import ThrottleSpeed from './ThrottleSpeed';
import JmriThrottleController from './JmriThrottleController';
import Functions from './Functions';
import { Context } from '../Store/Store';
import useDebounce from '../Shared/Hooks/useDebounce';
import api from '../Api';
import './Throttle.scss';

export const Throttle = props => {

  // const EMERGENCY_STOP = '-1.0';
	const STOP = '0.0';
  // const FULL_SPEED = '1.0';

  const { jmriApi, loco, cruiseDisabled, onLocoClick, loco: { 
    isAcquired, 
    speed, 
    autoStop,
    forward
  } } = props;
  const address = Number(props.loco.address);

  const calcSpeed = useCallback(origSpeed => origSpeed * 100 * (forward === true ? 1 : -1), [forward]);
  
  const initialMaxSpeed = isNaN(loco.maxSpeed) ? 100 : loco.maxSpeed;
  const initialUiSpeed = calcSpeed(speed);

  const [ , dispatch ] = useContext(Context);
  // const [ initialized, setInitialized ] = useState(false);
  const [ uiSpeed, setUiSpeed ] = useState(initialUiSpeed);
  const [ maxSpeed, setMaxSpeed ] = useState(initialMaxSpeed);
  const [ minSpeed, setMinSpeed ] = useState(-initialMaxSpeed);
  const [ precisonDialog, setPrecisonDialog ] = useState(false);
  const debouncedSpeed = useDebounce(uiSpeed, 100);

  // useEffect(() => {
  //   const newSpeed = calcSpeed(speed);
  //   if (newSpeed !== uiSpeed) {
  //     setUiSpeed(newSpeed);
  //   }
  // }, [speed, calcSpeed, uiSpeed]);

  const handleSliderSpeed = value => {
    setUiSpeed(value);
  }

  const handleStopClick = () => {
    setUiSpeed(parseInt(STOP));
  }

  const handleUpClick = () => {
    setUiSpeed(uiSpeed + 1);
  }

  const handleDownClick = () => {
    setUiSpeed(uiSpeed - 1);
  }

  const handleLocoClick = () => {
    if (onLocoClick) {
      onLocoClick(loco);
    }
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
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, isAcquired: false, cruiseControl: false } });
      await jmriApi.throttle(address, STOP);
      await jmriApi.releaseLoco(address);
    } catch (err) {
      console.error(err);
    }
    
  }

  const handleStickyThrottleClick = async () => {
    try {
      const newAutoStop = !loco.autoStop;
      await api.locos.put({ address, autoStop: newAutoStop });
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, autoStop: newAutoStop } });
    } catch (err) {
      console.error(err);
    }
  }

  const handleThrottlePrecisionClick = () => {
    setPrecisonDialog(true);
  }
  
  const handlePrecisonClose = () => {
    setPrecisonDialog(false);
  }
  
  const handlePrecisionChange = async (event) => {
    try {
      setMaxSpeed(event.target.value);
      setMinSpeed(-event.target.value);
      setPrecisonDialog(false);
      await api.locos.put({ address, maxSpeed: event.target.value });
      await dispatch({ type: 'UPDATE_LOCO', payload: { address, maxSpeed: event.target.value } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFunctionClick = async functionIndex => {

  }

  const roadClassName = () => {
    return loco.road.toLowerCase().replace(/ /g, '-');
  }

  const formattedAddress = () => loco.address && loco.address.length > 2
    ? loco.address.substring(0, 2)
    : loco.address;

  return (
    <>
      <Card 
        className={`throttle throttle--${loco.name.replace(' ', '')}  throttle--${loco.road.replace(' ', '')}`} >

        <CardHeader
          title={loco.name}
          avatar={
            <Avatar onClick={handleLocoClick} variant="square">{formattedAddress()}</Avatar>
            // <Chip
            //     label={`${formattedAddress()}`}
            //     icon={<TrainIcon />}
            //     className={roadClassName()}
            //     clickable
            //     onClick={handleLocoClick}
            //   />
          }
        />
        <CardContent className="throttle__content grow flex">
          {(true || loco.isAcquired) && 
            <Grid container spacing={1} className="grow">
              <Grid item xs={4} flexGrow={1} display="flex">
                  {isAcquired && (
                    <JmriThrottleController 
                      speed={debouncedSpeed} 
                      address={address} 
                      forward={(debouncedSpeed >= 0)} 
                    />
                  )}
                  <ThrottleSlider 
                    max={maxSpeed} 
                    className="throttle__slider__control" 
                    speed={uiSpeed} 
                    autoStop={autoStop} 
                    onChange={handleSliderSpeed} 
                  />
              </Grid>
              <Grid item xs={8} display="flex" className="throttle__controls">
                <Grid container spacing={1} className="grow" alignContent="space-between">
                  <Grid item xs={12}>
                    <img alt={`${loco.name}`} src={`${process.env.PUBLIC_URL}/images/tam/locos/${loco.address}.jpg`} className="throttle__locoimg" />

                      {/* <pre>speed={loco.speed}</pre>
                      <pre>uiSpeed={uiSpeed}</pre> */}
                  </Grid>
                  <Grid item xs={12}>

                    <Grid container spacing={1} className="grow" alignContent="space-between" direction="row">
                      <Grid item xs={5}>
                        <Paper elevation={3} className="" display="flex" direction="column" square>
                          <ThrottleSpeed speed={uiSpeed} />
                          <ButtonGroup
                              orientation="vertical"
                              className="throttle__controls__group"
                              aria-label="vertical outlined primary button group"
                            >
                            <IconButton 
                              className="speed-up-btn"
                              size="large" 
                              disabled={uiSpeed === maxSpeed} 
                              onClick={handleUpClick}>
                                <AddIcon />
                              </IconButton>
                            <IconButton 
                              className="speed-stop-btn"
                              size="large" 
                              color="primary" 
                              onClick={handleStopClick} >
                                <PanToolIcon />
                              </IconButton>
                            <IconButton 
                              className="speed-down-btn"
                              size="large" 
                              disabled={uiSpeed === minSpeed} 
                              onClick={handleDownClick}>
                                <RemoveIcon />
                            </IconButton>
                          </ButtonGroup>
                        </Paper>
                      </Grid>
                      <Grid item  xs={7}>
                        <Paper elevation={3} className="" display="flex" direction="column" square>
                          <ButtonGroup
                              orientation="vertical" size="large"
                              aria-label="vertical outlined primary button group"
                            >
                            <Button className="width100 textLeft" disabled size="large" label="Functions" variant="outlined" startIcon={<TrainIcon />}>Settings</Button>
                            
                            <Button className="width100 textLeft" size="large" label="Functions" variant="outlined" onClick={handleCruiceControlClick} startIcon={<TrainIcon />}>Functions</Button>
                            
                            <Button className="width100 textLeft" disabled={cruiseDisabled} size="large" label="Cruise Control" variant="outlined" onClick={handleCruiceControlClick} startIcon={<SpeedIcon />}>Cruise</Button>
                              
                              <Button className="width100 textLeft" size="large" onClick={handleParkClick} label="Park" variant="outlined" startIcon={<LocalParkingIcon />}>Park</Button>
                              
                              <Button className="width100 textLeft" size="large" onClick={handleThrottlePrecisionClick} label="Precision"  variant="outlined" startIcon={<ThermostatAutoIcon />} >Precision</Button>
                              
                              <Button className="width100 textLeft" size="large" onClick={handleStickyThrottleClick} label="Auto Stop" variant="outlined" startIcon={autoStop  ? <CompressIcon /> : <ExpandIcon/>} >Auto Stop</Button>
                            </ButtonGroup>
                          </Paper>
                        {/* <Grid item>
                          <Functions onFunctionClick={handleFunctionClick} />
                        </Grid> */}
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
          }
        </CardContent>
        
      </Card>

      <Dialog onClose={handlePrecisonClose} open={precisonDialog}>
        <DialogTitle>Set Throttle Min/Max</DialogTitle>
        <FormControl fullWidth sx={{ padding: '1rem' }}>
          <InputLabel id="minmax-label">Precison</InputLabel>
          <Select
            labelId="minmax-label"
            id="minmax"
            value={maxSpeed}
            label="Precison"
            onChange={handlePrecisionChange}
          >
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Dialog>
    </>
  )
}

export default Throttle;
