import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

import useLayoutRoadnames from '../Shared/Hooks/useLayoutRoadnames';

export const LocoName = ({ loco, consist }) => {

  const [roadname, roadlogo] = useLayoutRoadnames(loco?.meta?.roadname);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap'
    }}>
     <Chip variant="outline" icon={<ArrowCircleLeftOutlinedIcon />} label={loco.name} />      
      {roadlogo && roadlogo}
    </Box>
  );

}

export default LocoName;
