import React, { useContext, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import DraftsIcon from '@mui/icons-material/Drafts';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TrainIcon from '@mui/icons-material/Train';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';

import ConsistLoco from './ConsistLoco';
import AvailableConsistLoco from './AvailableConsistLoco';
import { useLocoStore } from '../Store/useLocoStore';
import { useThrottleStore } from '../Store/useThrottleStore';
import './ThrottleConsist.scss';

export const ThrottleConsist = ({ loco, consist = [], onChange, onClose }) => {

  const throttles = useThrottleStore(state => state.throttles);
  const upsertThrottle = useThrottleStore(state => state.upsertThrottle);
  const locos = useLocoStore(state => state.locos);
  const [newConsist, setNewConsist] = useState(consist);

  const handleAddLoco = async (address, direction, trim = 0) => {
    console.log('Add loco: ', address, direction, trim, consist);
    await setNewConsist([...newConsist, { address, direction, trim }]);
  }

  const handleClose = () => {
    onClose();
  }

  const handleSave = async () => {
    upsertThrottle({ address: loco.address, consist: newConsist });
    onChange(consist);
  }

  const handleRemoveLoco = async (idx) => {
    console.log('Remove loco: ', idx);
    await setNewConsist(newConsist.filter((_, i) => i !== idx));
  }

  const isLocoInUse = (aloco) => {
    return isLocoInConsist(aloco) || isLocoInThrottles(aloco) || aloco.address === loco.address;
  }

  const isLocoInConsist = (aloco) => {
    return newConsist?.some(t => t == aloco.address || t == -aloco.address);
  }

  const isLocoInThrottles = (aloco) => {
    return throttles.some(t => t?.consist?.map(c => c.address)?.includes(aloco.address) || t?.consist?.map(c => c.address).includes(-aloco.address));
  }

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Consist
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Stack
        className="current-consist"
        direction="row"
        alignItems="flex-start"
        useFlexGap
        spacing={1}
        flexWrap="wrap">
        <ConsistLoco loco={loco} dir="left" />
        {newConsist && newConsist.length > 0 && (newConsist.map((cloco, idx) => (
          // <div key={cloco}>{Math.abs(cloco)} {locos.find(l => l.address === Math.abs(cloco))?.name}</div>
          <ConsistLoco
            key={cloco.address}
            dir={cloco.direction ? 'left' : 'rigth'}
            locoIdx={idx}
            onRemoveLoco={handleRemoveLoco}
            loco={locos.find(l => l.address === cloco.address)} />
        )))}
      </Stack>

      <Stack
        className="available-locos"
        direction="row"
        useFlexGap
        spacing={1}
        flexWrap="wrap">
        {locos && locos.map((aloco) => (
          <AvailableConsistLoco key={aloco.name} loco={aloco} onAddLoco={handleAddLoco} disabled={isLocoInUse(aloco)} />
        ))}
      </Stack>
    </>
  );
}
export default ThrottleConsist;