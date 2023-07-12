import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
// import CallSplit from '@mui/icons-material/CallSplit';
// import { green } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
// import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
// import DoneIcon from '@mui/icons-material/Done';
import RestoreIcon from '@mui/icons-material/Restore';
// import LinkIcon from '@mui/icons-material/Link';
// import LinkOffIcon from '@mui/icons-material/LinkOff';
// import Info from '@mui/icons-material/Info';
import Lock from '@mui/icons-material/Lock';
// import Bookmark from '@mui/icons-material/Bookmark';
import LockOpen from '@mui/icons-material/LockOpen';
import InputAdornment from '@mui/material/InputAdornment';
// import CircularProgress from '@mui/material/CircularProgress';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Context } from '../Store/Store';
import api from '../Api';

const getInverse = degrees => {
  return degrees < 90
    ? 90 + (90 - degrees)
    : 90 - (degrees - 90);
}

export const Settings = props => {
  const { turnout: { turnoutId }, turnout, open, onClose } = props;

  const [ , dispatch ] = useContext(Context);

  const [name, setName] = useState(turnout.name);
  const [straight, setStraight] = useState(turnout?.config?.straight);
  const [divergent, setDivergent] = useState(turnout?.config?.divergent);
  const [isLoading, setIsLoading] = useState(false);
  // const [isLinked, setIsLinked] = useState(turnout.straight === getInverse(turnout.divergent));
  const [hasError, setHasError] = useState(false);
  const [isPristine, setIsPristine] = useState(true);

  const handleClose = () => {
    console.log(props);
    onClose();
  };

  // const handleLink = () => {
  //   setIsLinked(true);
  //   setDivergent(straight);
  // }

  // const handleUnlink = () => setIsLinked(false);

  const handleServo = degrees => {
    if (isLoading) { 
      return;
    }
    setIsLoading(true);
    setHasError(false);
    sendDegrees(degrees).then(resp => {
      console.log('complete', resp);
      setIsPristine(false);
    }).catch(err => {
      console.log(err);
      setHasError(true);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const resp = await api.turnouts.put({
        turnoutId,
        name,
        config: {
          type: turnout?.config?.type,
          straight,
          divergent
        }
      });
      await dispatch({ type: 'UPDATE_TURNOUT', payload: resp });
      onClose();
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetServo = () => {
    setStraight(turnout?.config?.straight);
    setDivergent(turnout?.config?.divergent);
  }

  const handleStraightChange = e => {
    const val = parseInt(e.target.value);
    if (isValidDegrees(val)) {
      setStraight(val);
      // if (isLinked) {
      //   setDivergent(getInverse(val));
      // }
    }
  }

  const isValidDegrees = value => {
    return true; // disable
    // const intValue = parseInt(value);
    // return (value === '' || 
    //   (/^\d+$/.test(value) && intValue >= 0 && intValue <= 360));
  }

  const handleDivergentChange = e => {
    const val = parseInt(e.target.value);
    if (isValidDegrees(val)) {
      setDivergent(val);
      // if (isLinked) {
      //   setStraight(getInverse(val));
      // }
    }
  }
  const sendDegrees = async degrees => {
    const turnout = await api.turnouts.put({ turnoutId, current: parseInt(degrees) });
    await dispatch({ type: 'UPDATE_TURNOUT', payload: turnout });
    return turnout;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Turnout Settings</DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={1} mb={3}>
          <DialogContentText>
            Changes are not saved until you click save.
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TextField
                margin="dense"
                id="number"
                label="Switch Num"
                size="small"
                disabled
                value={turnoutId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpen />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                id="name"
                label="Switch Name"
                value={name}
                onChange={e => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {/* <Bookmark /> */}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      {turnout?.config?.type === 'servo' && <>
        <Divider />
        <DialogTitle id="form-servo-title">
          Configure Servo
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={9}>
              <TextField
                margin="dense"
                id="straight"
                label="Straight"
                width="100px"
                disabled={isLoading}
                value={straight}
                onChange={handleStraightChange}
              />
              {/* {isLinked && (
                <IconButton aria-label="unlink" onClick={handleUnlink} disabled={isLoading}>
                  <LinkIcon />
                </IconButton>
              )}
              {!isLinked && (
                <IconButton aria-label="link" onClick={handleLink} disabled={isLoading}>
                  <LinkOffIcon />
                </IconButton>
              )} */}
              <TextField
                margin="dense"
                id="divergent"
                label="Divergent"
                width="100px"
                disabled={isLoading}
                value={divergent}
                onChange={handleDivergentChange}
              />
              <Box my={1}>
                <ButtonGroup variant="outlined" color="primary">
                  <Button onClick={handleResetServo} disabled={isLoading} startIcon={<RestoreIcon />}>
                    Reset
                  </Button>
                  <Button onClick={() => handleServo(straight)} disabled={isLoading}>
                    Straight
                  </Button>
                  <Button onClick={() => handleServo(divergent)} disabled={isLoading}>
                    Divergent
                  </Button>
                  <Button onClick={() => handleServo((straight + divergent) / 2)} disabled={isLoading}>
                    Center&deg;
                  </Button>
                </ButtonGroup>
                
              </Box>
              </Grid>
              {/* <Grid item xs={3}>
                {isLoading && (<CircularProgress color="primary" className="spinner" />)}
                {!isLoading && !isPristine && (<ErrorIcon color="action" style={{ color: green[500], fontSize: 80 }} />)}
                {hasError && !isLoading && (<ErrorIcon color="error" style={{ fontSize: 80 }} />)}
              </Grid> */}
            </Grid>
          </DialogContent>
        </>}
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default Settings;
