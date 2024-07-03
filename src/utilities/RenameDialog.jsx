import React from 'react';
import {
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        Typography,
        TextField,
} from '@mui/material';

const RenameDialog = ({ open, onClose, onConfirm, initialValue }) => {
        const [newName, setNewName] = React.useState(initialValue);

        const handleInputChange = (e) => {
                setNewName(e.target.value);
        };

        return (
                <Dialog open={open} onClose={onClose}>
                        <DialogTitle>Rename Collection</DialogTitle>
                        <DialogContent>
                                <TextField
                                        label="New Collection Name"
                                        fullWidth
                                        value={newName}
                                        onChange={handleInputChange}
                                />
                        </DialogContent>
                        <DialogActions>
                                <Button onClick={onClose} color="primary">
                                        Cancel
                                </Button>
                                <Button onClick={() => onConfirm(newName)} color="primary" variant="contained">
                                        Rename
                                </Button>
                        </DialogActions>
                </Dialog>
        );
};

export default RenameDialog;
