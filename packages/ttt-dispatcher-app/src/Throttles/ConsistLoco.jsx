  import React from 'react';

  import Card from '@mui/material/Card';
  import CardHeader from '@mui/material/CardHeader';
  import IconButton from '@mui/material/IconButton';
  import CardContent from '@mui/material/CardContent';
  import Chip from '@mui/material/Chip';
  import RemoveCircle from '@mui/icons-material/RemoveCircle';
  import SteamLocoSvg from '../Shared/Images/locos/steam-icon.svg?react';
  import DieselLocoSvg from '../Shared/Images/locos/diesel-icon.svg?react';

  import { useLayoutRoadnames } from '../Shared/Hooks/useLayoutRoadnames';

  const limitString = (str, maxLength) => {
    if (str?.length <= maxLength) {
      return str;
    } else {
      return str?.slice(0, maxLength);
    }
  };

  const ConsistLoco = ({ loco, locoIdx, dir, onRemoveLoco }) => {
    const [roadname] = useLayoutRoadnames(loco?.meta?.roadname);
    return (

    <Card className={`consisted-loco ${roadname?.toLowerCase()}`}>
      <CardHeader
        avatar={
          <Chip className="throttle-nameplate" label={limitString(loco?.name, 4)} size="small" variant="outlined"></Chip>
        }
        action={onRemoveLoco && 
          <IconButton aria-label="settings" onClick={() => onRemoveLoco(locoIdx)}>
            <RemoveCircle />
          </IconButton>
        }
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        <DieselLocoSvg className={`consist-loco consist-loco--${dir}`} />
      </CardContent>
    </Card>
    );
  };

  export default ConsistLoco;