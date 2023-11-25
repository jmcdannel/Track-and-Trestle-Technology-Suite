
import React, { useContext, useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import api from '../Shared/api/api';

export const layoutIds = [
  'tam',
  'betatrack'
];

export const LayoutIdDialog = ({ onClose, open }) => {

  const [layoutId, setLayoutId] = useState(null);

  useEffect(() => {
    async function loadLayoutId() {
      const _layoutId = await api.config.getLayoutId();
      setLayoutId(_layoutId);
    }
    loadLayoutId();
  }, []);

  const handleUpdate = async () => {
    console.log('handleUpdate', layoutId);
    await api.config.selectLayout(layoutId);
    window.location.reload(false);
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Layout ID</DialogTitle>
      <Autocomplete
        sx={{ padding: '1rem', width: '360px' }}
        id="layout-id"
        freeSolo
        onInputChange={(event, newValue) => {
          setLayoutId(newValue);
        }}
        onChange={(event, newValue) => {
          setLayoutId(newValue);
        }}
        options={layoutIds}
        value={layoutId}
        renderInput={(params) => <TextField {...params} label="Layout ID" />}
      />
      <Button 
        size="large" 
        startIcon={<SaveIcon />}
        onClick={handleUpdate}>
          Save              
      </Button>
    </Dialog>
  );
}

export default LayoutIdDialog;