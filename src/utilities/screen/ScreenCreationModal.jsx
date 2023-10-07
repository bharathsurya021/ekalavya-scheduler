import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

const ScreenCreationModal = ({ open, onClose, onCreateScreen }) => {
  const [screenName, setScreenName] = useState('');

  const handleCreateScreen = () => {
    if (screenName) {
      onCreateScreen({
        id: Math.random().toString(36).substring(7),
        title: screenName,
      });
      setScreenName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Screen</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Screen Name"
          type="text"
          fullWidth
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateScreen} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreenCreationModal;
