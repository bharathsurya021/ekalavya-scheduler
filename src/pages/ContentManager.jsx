import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Stack,
  Button,
} from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../utilities/DashboardCard';
import CollectionList from '../utilities/collection/CollectionList';
import CollectionCreationModal from '../utilities/collection/CollectionCreationModal';

const initialCollections = [
  {
    id: 1,
    name: 'Collection 1',
    files: [
      { id: 1, name: 'File 1', url: 'https://example.com/file1.pdf' },
      { id: 2, name: 'File 2', url: 'https://example.com/file2.pdf' },
    ],
  },
  {
    id: 2,
    name: 'Collection 2',
    files: [
      { id: 3, name: 'File 3', url: 'https://example.com/file3.pdf' },
    ],
  },
];

const ContentManager = () => {
  const [collections, setCollections] = useState(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateCollectionClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateCollection = (newCollection) => {
    setCollections([...collections, newCollection]);
    setIsModalOpen(false);
    // navigate('/collectionview', { state: { collection: newCollection } });
  };

  const handleViewCollection = (collection) => {
    navigate('/collectionview', { state: { collection } });
    console.log('collection view clicked');
  };

  return (
    <PageContainer title="Content manager" description="Manage your collections and files">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard title="Content Manager" subtitle="Manage your content collections and files.">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Stack direction={'row'} spacing={3} mb={3}>
                  <Button variant="contained" color="primary" onClick={handleCreateCollectionClick}>
                    Create Collection
                  </Button>
                </Stack>
                <Typography>Collections</Typography>
                <CollectionList collections={collections} onViewCollection={handleViewCollection} />
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
      <CollectionCreationModal open={isModalOpen} onClose={handleModalClose} onCreateCollection={handleCreateCollection} />
    </PageContainer>
  );
};

export default ContentManager;
