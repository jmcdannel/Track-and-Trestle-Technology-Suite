import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BnsfLogoSvg from '../Shared/Images/logos/bnsf.svg?react';

import useLayoutRoadnames from '../Shared/Hooks/useLayoutRoadnames';

import './LocoName.scss';

export const LocoName = ({ loco }) => {

  const [roadname, roadlogo] = useLayoutRoadnames(loco?.meta?.roadname);
 
  return (
    <Box className="loco-name">
      <Typography>{roadname} - {loco.name}</Typography>
      {loco.consist && loco.consist.length > 0 && loco.consist
        .map(cLoco => <Typography key={cLoco}>{cLoco}</Typography>)}
      {roadlogo && roadlogo}
    </Box>
  );

}

export default LocoName;
