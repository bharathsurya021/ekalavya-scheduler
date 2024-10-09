import React from 'react';
import { Grid } from '@mui/material';
import CollectionCard from './CollectionCard';

const CollectionList = ({ collections, onOptionClick }) => {
  return (
    <Grid container spacing={2}>
      {collections.map((collection) => (
        <Grid item sm={3} key={collection.collection_id}>
          <CollectionCard title={collection.collection_name} onOptionClick={onOptionClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CollectionList;
