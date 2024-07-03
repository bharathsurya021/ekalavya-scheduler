import React, { useState } from 'react';
import {
        Dialog,
        DialogTitle,
        DialogContent,
        TextField,
        DialogActions,
        Button,
} from '@mui/material';

const CollectionCreationModal = ({ open, onClose, onCreateCollection }) => {
        const [collectionName, setCollectionName] = useState('');

        const handleCreateCollection = () => {
                if (collectionName) {
                        onCreateCollection({
                                id: Math.random().toString(36).substring(7),
                                name: collectionName,
                                files: [], // Initially, the collection has no files
                        });
                        setCollectionName('');
                }
        };

        return (
                <Dialog open={open} onClose={onClose}>
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
                                <Button onClick={onClose} color="primary">
                                        Cancel
                                </Button>
                                <Button onClick={handleCreateCollection} color="primary">
                                        Create
                                </Button>
                        </DialogActions>
                </Dialog>
        );
};

export default CollectionCreationModal;
