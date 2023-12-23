import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export const PrecisionDialog = ({ open, onClose, setPrecision }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Throttle Precision</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton onClick={() => setPrecision(20)}>
            <ListItemText primary={20} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton onClick={() => setPrecision(50)}>
            <ListItemText primary={50} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton onClick={() => setPrecision(100)}>
            <ListItemText primary={100} />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default PrecisionDialog;