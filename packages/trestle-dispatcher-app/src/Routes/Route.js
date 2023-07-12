import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardContent';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import AltRouteIcon from '@mui/icons-material/AltRoute';

import './Route.scss';

const lineColors = {
  'Valley': 'rgb(13, 242, 40)',
  'Tamarack Station': 'rgb(0, 255, 253)',
  'Valley City': 'rgb(206, 217, 38)'
}

export const Route = props => {

  const { route, handleRouteToggle } = props;  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <Card className={route.className}>
      <CardHeader className="route__header">
          <Chip
            label={`${route.name}`}
            variant={route.variant}
            icon={<AltRouteIcon />}
            size="small"
             sx={{ borderColor: lineColors[route.line] }}
            clickable
            disabled={route.disabled}
            onClick={e => handleRouteToggle(route, true)}
          />
      </CardHeader>
      <CardContent className="route__id">
        <Typography variant="body2" gutterBottom>
          {route.line}
        </Typography> 
      </CardContent>
      <CardActions className="route__actions">
        <Button 
          className="compact-hidden"
          variant="outlined" 
          color="secondary" 
          onClick={handleToggle}
          >
            Toggle
        </Button>
      </CardActions>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} message={error} />
    </Card>
  );
}

export default Route;