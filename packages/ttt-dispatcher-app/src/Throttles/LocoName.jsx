import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

import useLayoutRoadnames from '../Shared/Hooks/useLayoutRoadnames';

export const LocoName = ({ loco }) => {

  const [roadname, roadlogo] = useLayoutRoadnames(loco?.meta?.roadname);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexWrap: 'wrap'
    }}>
     <Chip variant="outline" icon={<ArrowCircleLeftOutlinedIcon />} label={loco.address} />
      {loco.consist && loco.consist.length > 0
        && ( <Chip variant="outline" icon={<ArrowCircleLeftOutlinedIcon />} label={loco.name} />)
        && loco.consist.map(cLoco =>
          <>
            <Divider sx={{
              border: '0',
              height: '8px',
              marginLeft: '0px',
              marginRight: '0',
              padding: '0 15px',
              backgroundColor: 'rgba(255, 255, 255, 0.16)'
            }} />
            <Chip
              variant="outline"
              icon={cLoco > 0 ? <ArrowCircleLeftOutlinedIcon /> : <ArrowCircleRightOutlinedIcon />}
              key={cLoco}
              label={Math.abs(cLoco)}
            />
          </>)}
      {/* {roadlogo && roadlogo} */}
    </Box>
  );

}

export default LocoName;
