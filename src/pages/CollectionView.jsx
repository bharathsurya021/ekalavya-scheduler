import React, { useState } from 'react';
import {
        Typography,
        Grid,
        Button,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        List,
        ListItem,
        ListItemText,
        IconButton,
} from '@mui/material';
import { Delete, Visibility, Add } from '@mui/icons-material';
import PageContainer from '../components/containers/PageContainer';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom

const CollectionViewPage = () => {
        const location = useLocation(); // Get location object
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [collection, setCollection] = useState(location.state?.collection || null);
        const [newFile, setNewFile] = useState(null); // For file upload logic, if needed

        const handleAddFileClick = () => {
                setIsDialogOpen(true);
        };

        const handleAddFile = () => {
                // Implement file upload logic here if needed
                setIsDialogOpen(false);
                // Update collection state if new file is added
                if (newFile) {
                        const updatedCollection = {
                                ...collection,
                                files: [...collection.files, newFile],
                        };
                        setCollection(updatedCollection);
                        setNewFile(null); // Reset newFile state
                }
        };

        const handleDeleteFile = (fileId) => {
                const updatedFiles = collection.files.filter((file) => file.id !== fileId);
                const updatedCollection = {
                        ...collection,
                        files: updatedFiles,
                };
                setCollection(updatedCollection);
        };

        const handleViewFile = (fileUrl) => {
                // Implement view file logic if needed
                console.log(`Viewing file: ${fileUrl}`);
        };

        const handleClose = () => {
                // Handle closing of the collection view page, e.g., navigate back or close modal
                console.log('Closing collection view');
        };

        if (!collection) {
                return (
                        <PageContainer title="Collection View">
                                <Typography variant="h6">Collection not found.</Typography>
                                <Button variant="contained" color="primary" onClick={handleClose}>
                                        Close
                                </Button>
                        </PageContainer>
                );
        }

        return (
                <PageContainer title={`Collection: ${collection.name}`}>
                        <Grid container spacing={3}>
                                <Grid item xs={12}>
                                        <Typography variant="h4">Files in Collection: {collection.name}</Typography>
                                        <List>
                                                {collection.files.map((file) => (
                                                        <ListItem key={file.id}>
                                                                <ListItemText primary={file.name} secondary={file.url} />
                                                                <IconButton onClick={() => handleViewFile(file.url)} aria-label="View">
                                                                        <Visibility />
                                                                </IconButton>
                                                                <IconButton onClick={() => handleDeleteFile(file.id)} aria-label="Delete">
                                                                        <Delete />
                                                                </IconButton>
                                                        </ListItem>
                                                ))}
                                        </List>
                                </Grid>
                                <Grid item xs={12}>
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddFileClick}
                                                startIcon={<Add />}
                                        >
                                                Add File to Collection
                                        </Button>
                                </Grid>
                                <Grid item xs={12}>
                                        <Button variant="contained" color="primary" onClick={handleClose}>
                                                Close
                                        </Button>
                                </Grid>
                        </Grid>

                        {/* Add File Dialog */}
                        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                                <DialogTitle>Add File to Collection</DialogTitle>
                                <DialogContent>
                                        {/* Your file upload or selection form */}
                                        <Typography variant="body1">Add your file upload or selection form here.</Typography>
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={() => setIsDialogOpen(false)} color="primary">
                                                Cancel
                                        </Button>
                                        <Button onClick={handleAddFile} color="primary">
                                                Add File
                                        </Button>
                                </DialogActions>
                        </Dialog>
                </PageContainer>
        );
};

export default CollectionViewPage;
