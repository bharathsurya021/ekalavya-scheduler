import React from 'react';
import { Grid } from '@mui/material';
import CollectionCard from './CollectionCard';

const CollectionList = ({ collections, onViewCollection }) => {
        return (
                <Grid container spacing={2}>
                        {collections.map((collection) => (
                                <Grid item sm={3} key={collection.id}>
                                        <CollectionCard
                                                name={collection.name}
                                                id={collection.id}
                                                onOptionClick={(option) => {
                                                        if (option === 'View' || option === 'Preview') {
                                                                onViewCollection(collection);
                                                        } else {
                                                                console.log(`Option Clicked: ${option}`);
                                                        }
                                                }}
                                        />
                                </Grid>
                        ))}
                </Grid>
        );
};

export default CollectionList;
