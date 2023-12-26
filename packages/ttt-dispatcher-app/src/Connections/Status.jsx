import React from 'react';
import { Link , useLocation} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import SignalWifiStatusbarNullIcon from '@mui/icons-material/SignalWifiStatusbarNull';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';

import { useConnectionStore, CONNECTION_STATUS } from '../Store/useConnectionStore';

export const Status = props => {

  const status = useConnectionStore(state => state.status);
  const dccApiStatus = useConnectionStore(state => state.dccApiStatus);
  const dccDeviceStatus = useConnectionStore(state => state.dccDeviceStatus);

  return (
    <Link to="/settings">
      <IconButton
      >
        {status === CONNECTION_STATUS.CONNECTED 
          && dccApiStatus === CONNECTION_STATUS.CONNECTED 
          && dccDeviceStatus === CONNECTION_STATUS.CONNECTED
          ? <SignalWifiStatusbar4BarIcon sx={{ fill: '#21ff15' }} />
          : <SignalWifiStatusbarNullIcon sx={{ fill: 'red' }} />}
      </IconButton>
    </Link>
  )
}

export default Status
