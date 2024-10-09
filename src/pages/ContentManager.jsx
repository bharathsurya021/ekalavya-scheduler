import React, { useState } from 'react';
import { Typography, Grid, Stack, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import CollectionCard from '../utilities/collection/CollectionCard';

const ContentManager = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCollectionClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCollectionName(''); // Clear input field
  };

  const handleCreateCollection = () => {
    if (collectionName) {
      setCollections([...collections, { id: collections.length + 1, title: collectionName }]);
      setIsModalOpen(false);
      setCollectionName('');
    }
  };

  return (
    <DashboardLayout title="Content Manager" subtitle="Manage your collections for your site.">
      <Stack direction="row" spacing={3} mb={3}>
        <Button variant="contained" color="primary" onClick={handleCreateCollectionClick}>
          Create Collection
        </Button>
      </Stack>
      <Typography>Collections</Typography>
      <Grid container spacing={2}>
        {collections.map((collection) => (
          <Grid item sm={3} key={collection.id}>
            <CollectionCard title={collection.title} onOptionClick={(option) => console.log(`Option Clicked: ${option}`)} />
          </Grid>
        ))}
      </Grid>

      {/* Collection Creation Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Create Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">Cancel</Button>
          <Button onClick={handleCreateCollection} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContentManager;
