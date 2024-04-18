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
import CardHeader from '@mui/material/CardHeader';
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
import useLayoutLines from '../Shared/Hooks/useLayoutLines';
import { useTurnout } from './useTurnout';
import { useMqtt } from '../Core/Com/MqttProvider'

import './Turnout.scss';

export const Turnout = props => {

  const { turnout, handleTurnoutChange } = props;

  const [isDivergent, setIsDivergent] = useState(!turnout.state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { updateTurnout } = useTurnout();
  const [ line ] = useLayoutLines(turnout?.meta?.line);

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
      const delta = { 
        ...turnout,
        state: isDivergent
      }
      // publish('ttt-turnout', JSON.stringify({ action: 'turnout', payload: delta }));
      // handleTurnoutChange(delta);
      updateTurnout(delta)
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
      const delta = { 
        ...turnout,
        state: false
      }
      // publish('ttt-turnout', JSON.stringify(delta));
      updateTurnout(delta)
      // handleTurnoutChange(delta);
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
    <Card className={`turnout turnout__line__${line?.id}`}>
      {/* <CardHeader 
        className="turnout__header" 
        avatar={<CallSplit />}
        // action={isLoading || isPristine 
        //   ? <PortableWifiOffIcon style={{color: 'gray'}} /> 
        //   :  <WifiTetheringIcon style={{color: 'green'}} />}        
      >
        
          <Box className="turnout__header__status">
                
          </Box>
      </CardHeader> */}
      <CardContent className="turnout__content">
        <CardActionArea className={`turnout__state ${isLoading ? 'loading' : ''}`} onClick={handleToggle}>

          <Box className={`turnout__id`}>
            
            <CallSplit className="turnout__line" />

            <Box className={`turnout__name`}>
              <Typography component="span" variant="h6" noWrap  className="turnout__line">
                {turnout.name}
              </Typography>
              <Typography component="small" variant="small" noWrap sx={{ paddingLeft: '0.25rem'}} >
                  [{line?.abbr.substring(0, 2) || '??'}]
              </Typography>
            </Box>
            <Chip label={turnout.turnoutId} size="small" />
            
          </Box>
          
          {isLoading && (<CircularProgress color="primary" className="spinner" />)}
          <Box className={`turnout__indicator turnout__indicator__${isDivergent ? 'divergent' : 'straight'}`}>
            <Box sx={{ width: '5rem' }} className="turnout__line">
              <TurnoutIndSvg />
            </Box>
          </Box>
        </CardActionArea>
      </CardContent>
      <CardActions className="turnout__actions">
        {/* <IconButton variant="outlined" onClick={handleReset} color="primary" disabled={isLoading}>
          <RestoreIcon />
        </IconButton> */}
        <IconButton variant="outlined" color="default" onClick={handleSettings}>
          <TuneIcon />
        </IconButton>
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