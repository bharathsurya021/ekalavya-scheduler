import React from 'react';
import { Typography, Stack, Button, CircularProgress, Alert, Box } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import CollectionList from '../components/collection/CollectionList';
import useFetchCollections from '../hooks/useFetchCollections';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';

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
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleCreateCollectionClick}>
          Add
        </Button>
      </Stack>
      <Stack spacing={3} mb={3}>

        <Typography >Collections</Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">Failed to fetch collections: {error.message}</Alert>
        ) : collections.length > 0 ? (
          <Box>
            <CollectionList collections={collections} onOptionClick={handleOptionClick} onDelete={handleDeleteCollectionClick} />
          </Box>
        ) : (
          <Typography>No collections found. Please create a new collection.</Typography>
        )}
      </Stack>

    </DashboardLayout>
  );
};

export default ContentManager;
