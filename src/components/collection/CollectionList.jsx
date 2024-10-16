import React from 'react';
import { Grid } from '@mui/material';
import CollectionCard from './CollectionCard';

const CollectionList = ({ collections, onOptionClick, onDelete }) => {
  return (
    <Grid container spacing={2}>
      {collections.map((collection) => (
        <Grid item sm={3} key={collection._id}>
          <CollectionCard title={collection.collection_name} onOptionClick={onOptionClick} collectionName={collection.collection_id} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CollectionList;
