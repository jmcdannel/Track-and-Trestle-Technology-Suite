import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';

import useConnectionStore from '../Store/useConnectionStore';
const layoutIds = ['tam', 'betatrack', 'shelf'];

export const LayoutDialog = ({ onClose, open }) => {

  const layoutId = useConnectionStore(state => state.layoutId);
  const setLayoutId = useConnectionStore(state => state.setLayoutId);
  const [newLayoutId, setNewLayoutId] = useState(layoutId);

  const handleUpdate = async () => {
    console.log('handleLayoutUpdate', newLayoutId);
    await setLayoutId(newLayoutId);
    onClose()
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Layout ID</DialogTitle>
      <Autocomplete
          sx={{ padding: '1rem', width: '360px' }}
          id="layout-id"
          freeSolo
          options={layoutIds}
          value={layoutId}
          onInputChange={(event, newValue) => {
            setNewLayoutId(newValue);
          }}
          onChange={(event, newValue) => {
            setNewLayoutId(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Layout ID" />}
        />
        <Button 
          size="large" 
          startIcon={<SaveIcon />}
          onClick={handleUpdate}>
            Save              
        </Button>
      </Dialog>
  )
}

export default LayoutDialog;
