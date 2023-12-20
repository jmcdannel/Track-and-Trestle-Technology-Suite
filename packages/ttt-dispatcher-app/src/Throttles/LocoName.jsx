import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import useLayoutRoadnames from '../Shared/hooks/useLayoutRoadnames';

import './LocoName.scss';


export const LocoName = ({ loco }) => {

  const [roadname, roadlogo] = useLayoutRoadnames(loco?.meta?.roadname);

  function renderLogo() {
    switch (loco?.meta?.roadname) {
      case 'bnsf':
        return <BnsfLogoSvg  />
      case 'up':
        return <UpLogoSvg  />
      case 'sf':
        return <SfLogoSvg  />
      case 'mr':
        return <img src={MRLLogoPng} />
      default:
        return null
    }
  }
    
    return (
      <Box className="loco-name">
        <Typography>{loco.name}</Typography>
        {roadlogo && <Box className="roadlogo">{roadlogo}</Box>}
      </Box>
    );
  
  }

  export default LocoName;
