import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DraftsIcon from '@mui/icons-material/Drafts';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TrainIcon from '@mui/icons-material/Train';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';

const defaultLoco = '';

export const ThrottleConsist = ({ consist = [], locos = [], onChange }) => {

  const [newLoco, setNewLoco] = React.useState(defaultLoco);
  const [fwd, setFwd] = React.useState(true);

  const handleChange = (event) => {
    setNewLoco(event.target.value);
  };

  const handleAddLoco = () => {
    console.log('Add loco: ', newLoco, consist);
    const newConsist = [...consist, fwd ? newLoco : -newLoco];
    onChange(newConsist);
    reset();
  }

  const handleRemoveLoco = (idx) => {
    console.log('Remove loco: ', idx);
    const newConsist = [...consist];
    newConsist.splice(idx, 1);
    onChange(newConsist);
    reset();
  }

  const reset = () => {
    setNewLoco(defaultLoco);
    setFwd(true);
  }

  return (
    <>
    <h2>Consist</h2>
    <List dense={false}>
      {consist && consist.length > 0 && (consist.map((loco, idx) => (
        <ListItem key={loco}              
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() =>handleRemoveLoco(idx)}>
              <RemoveCircleIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <TrainIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText secondary={(idx+1)} />
          <ListItemText primary={Math.abs(loco)} />
          <ListItemText secondary={loco < 0 ? 'rev' : 'fwd'} />
        </ListItem>          
      )))}
      <Divider />
      <ListItem              
        secondaryAction={
          <IconButton edge="end" aria-label="add" onClick={handleAddLoco}>
            <AddIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <TrainIcon />
          </Avatar>
        </ListItemAvatar>

        <ListItemText secondary={(consist ? consist.length+1 : 1)} />
        <FormControl fullWidth>
          <InputLabel id="consist-loco-label">DPU</InputLabel>
          <Select
            labelId="consist-loco-label"
            id="consist-loco"
            value={newLoco}
            size="small"
            label="DPU"
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            {locos && locos.map((loco) => (
              <MenuItem key={loco.address} value={loco.address}>{loco.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel control={              
          <Switch
            label="FWD"
            edge="end"
            size="small"
            checked={fwd}
            onChange={(e) => setFwd(e.target.checked)}
          />
        } label="FWD" />
      </ListItem>
    </List>
    </>
  );
}
export default ThrottleConsist;