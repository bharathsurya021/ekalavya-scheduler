import React from 'react';
import { Typography, Stack, Button, CircularProgress, Alert } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import CollectionList from '../utilities/collection/CollectionList';
import useFetchCollections from '../hooks/useFetchCollections';
import { useNavigate } from 'react-router-dom';

const ContentManager = () => {
  const { collections, loading, error, onDelete } = useFetchCollections();
  const navigate = useNavigate();

  const handleCreateCollectionClick = () => {
    navigate('/dashboard/content/create');
  };
  const handleOptionClick = (action, collectionName) => {
    if (action === 'Edit') {
      navigate(`/dashboard/content/edit/${collectionName}`);
    } else if (action === 'Preview') {
      navigate(`/dashboard/content/view/${collectionName}`);

    }
  };

  const handleDeleteCollectionClick = (collectionName) => {
    onDelete(collectionName)
  }


  return (
    <DashboardLayout title="Content Manager" subtitle="Manage your collections for your site.">
      <Stack direction="row" spacing={3} mb={3}>
        <Button variant="contained" color="primary" onClick={handleCreateCollectionClick}>
          Create Collection
        </Button>
      </Stack>
      <Typography variant="h6">Collections</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">Failed to fetch collections: {error.message}</Alert>
      ) : collections.length > 0 ? (
        <CollectionList collections={collections} onOptionClick={handleOptionClick} onDelete={handleDeleteCollectionClick} />
      ) : (
        <Typography>No collections found. Please create a new collection.</Typography>
      )}
    </DashboardLayout>
  );
};

export default ContentManager;
