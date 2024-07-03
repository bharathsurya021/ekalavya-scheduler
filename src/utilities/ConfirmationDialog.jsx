import React from 'react';
import {
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        Typography,
} from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
        return (
                <Dialog open={open} onClose={onClose}>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogContent>
                                <Typography>{content}</Typography>
                        </DialogContent>
                        <DialogActions>
                                <Button onClick={onClose} color="primary">
                                        Cancel
                                </Button>
                                <Button onClick={onConfirm} color="primary" variant="contained">
                                        Confirm
                                </Button>
                        </DialogActions>
                </Dialog>
        );
};

export default ConfirmationDialog;