import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardContent';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import AltRouteIcon from '@mui/icons-material/AltRoute';

import { useLayoutLines } from '../Shared/Hooks/useLayoutLines';

import './Route.scss';
export const Route = props => {

  const { route, enabled, handleRouteToggle } = props;  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [ line ] = useLayoutLines(route?.line);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
  };

  const handleToggle = async e => {
    if (isLoading) { 
      return;
    }
    try {
      setIsLoading(true);
      await handleRouteToggle(route);
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }    
  }

  return route ? (
    <Card className={`${route.className}  route__line__${line?.id}`}
      sx={{
      }}>
      <CardActionArea
        disabled={route.disabled}
        className={`route__state`} 
        onClick={handleToggle}>
      <CardHeader className="route__header">
          <AltRouteIcon />
        </CardHeader>
        <CardContent className="route__content">
          <Typography component="h6" variant="h6" noWrap >
            {route.name} - {route.routeId}
          </Typography>
          <Box className={`route__line`}>
            <Typography component="h6" variant="h6" noWrap >
                {route.disabled ? 'X' : 'OK'}
              </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
  ) : null;
}

export default Route;