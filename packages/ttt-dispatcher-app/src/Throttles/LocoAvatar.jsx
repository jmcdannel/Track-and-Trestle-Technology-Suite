import React, { useContext } from 'react';
import { Badge, Avatar } from '@mui/material';
import { Context } from '../Store/Store';

const LocoAvatar = ({ loco }) => {
  const [ , dispatch ] = useContext(Context);
  const formattedAddress = (loco) => {
    // Format the address here
    return loco.address;
  };

  const handleLocoClick = async () => {
    await dispatch({ type: 'UPDATE_LOCO', payload: { address: loco.address, cruiseControl: false } }); 
    if (onLocoClick) {
      onLocoClick(loco);
    }
  }

  return (
    <Badge 
      badgeContent={1 + (loco.consist?.length || 0)} 
      color="info"
      className="throttle__consist-badge"
      invisible={!loco?.consist?.length}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Avatar sx={{ width: '4rem', height: '4rem' }} onClick={handleLocoClick} variant="square">
        {formattedAddress(loco)}
      </Avatar>
    </Badge>
  );
};

export default LocoAvatar;