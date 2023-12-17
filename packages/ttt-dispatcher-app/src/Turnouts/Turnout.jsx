/// <reference types="vite-plugin-svgr/client" />
import React, { useState, useEffect } from 'react';
import * as Colors from '@mui/material/colors';
// import { ReactComponent as TurnoutStriaghtImage } from '../Shared/Images/turnout-straight.svg';
// import { ReactComponent as TurnoutDivergentImage } from '../Shared/Images/turnout-divergent.svg';
import Settings from './Settings';

import Box from '@mui/material/Box';
import SvgIcon from "@mui/material/SvgIcon";
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardContent';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import RestoreIcon from '@mui/icons-material/Restore';
import TuneIcon from '@mui/icons-material/Tune';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CallSplit from '@mui/icons-material/CallSplit';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import PortableWifiOffIcon from '@mui/icons-material/PortableWifiOff';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

import TurnoutIndSvg from './TurnoutInd.svg?react';

import './Turnout.scss';

export const linesConfig = [
  { lineId: 'Demo Track', label: 'Mainline SB', color: Colors.red[500] }
];

export const Turnout = props => {

  const { turnout, handleTurnoutChange } = props;  

  const [isDivergent, setIsDivergent] = useState(!turnout.state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setIsDivergent(!turnout.state);
  }, [turnout.state]);

  const handleToggle = async e => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      setIsPristine(false);
      console.log('[Turnout] handleToggle', turnout)
      await handleTurnoutChange({ 
        ...turnout,
        state: !turnout.state 
      });
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }    
  }

  const handleReset = async e => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      setIsPristine(false);
      await handleTurnoutChange({ 
        turnoutId: turnout.turnoutId, 
        state: false
      });
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  }

  const handleSettings = () => setShowSettings(true);

  const hideSettings = () => setShowSettings(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };


	return (
    <Card className={`turnout`}>
      <CardHeader className="turnout__header">
        <CallSplit />
        <Typography variant="h6" >{turnout.name}</Typography>
          <Box className="turnout__header__status">
            {isLoading || isPristine 
              ? <PortableWifiOffIcon style={{color: 'gray'}} /> 
              :  <WifiTetheringIcon style={{color: 'green'}} />}            
          </Box>
      </CardHeader>
      <CardContent className="turnout__id">
        

        <CardActionArea className={`turnout__state ${isLoading ? 'loading' : ''}`} onClick={handleToggle}>
            <div className="turnout__indicator">{isDivergent ? 'divergent' : 'straight'}</div>
            {/* <SvgIcon>
              <TurnoutIndSvg />
            </SvgIcon> */}
            
            <Typography component="h6" variant="h6" noWrap >
              {turnout.name}
            </Typography>
            {isLoading && (<CircularProgress color="primary" className="spinner" />)}
        </CardActionArea>          

      </CardContent>
      <CardActions className="turnout__actions">
        <Button 
          className="compact-hidden"
          variant="contained" 
          color="primary" 
          onClick={handleToggle}
          // startIcon={<CallSplit />}
          >
            Toggle
        </Button>
        <span>
          <IconButton variant="outlined" onClick={handleReset} color="primary" disabled={isLoading}>
            <RestoreIcon />
          </IconButton>
          {/* <IconButton variant="outlined" color="default">
            <MapIcon />
          </IconButton> */}
          <IconButton variant="outlined" color="default" onClick={handleSettings}>
            <TuneIcon />
          </IconButton>
        </span>
      </CardActions>
      {showSettings && 
        <Settings 
          open={showSettings} 
          turnout={turnout} 
          onClose={hideSettings}
        />
      }
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
	)

}

export default Turnout;