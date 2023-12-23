import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import PanToolIcon from '@mui/icons-material/PanTool';
import { Context } from '../Store/Store';
import dccApi from '../Shared/api/dccApi';

const STOP = '!';

export const Stop = props => {

  const [ state, dispatch ] = useContext(Context);
  const { locos } = state;

  const handleStopClick = async () => {
    console.log('handleStopClick');

    try {
      await dccApi.send('dcc', '!');
      // await dccApi.setSpeed(loco.address), 0);
    } catch (err) { console.error(err); }
    // locos && locos.filter(loco => loco.isAcquired).map(async loco => {
    //   try {
    //     await dccApi.setSpeed(loco.address), 0);
    //   } catch (err) { console.error(err); }
    //   try {
    //     await dispatch({ type: 'UPDATE_LOCO', payload: { address: loco.address, speed: 0 } });
    //   } catch (err) { console.error(err); }
    //   console.log('Stopped', loco, STOP);
    // });
  }

  return (
    <IconButton
      className="header-button"
      onClick={handleStopClick} 
      color="inherit"
      variant="outlined"
    >
      <PanToolIcon />
    </IconButton>)
}

export default Stop;