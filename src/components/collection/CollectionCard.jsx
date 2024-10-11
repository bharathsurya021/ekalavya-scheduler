import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';
import ConfirmationDialog from './ConfirmationDialog';
import { deleteCollection } from '../../api/collections';
import { useAuth } from '../AuthContext';

const CollectionCard = React.memo(({ title, collectionName, onOptionClick, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { token } = useAuth()
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteCollection(collectionName, token);
      onDelete(collectionName)
    } catch (error) {
      console.error('Failed to delete collection:', error);
    } finally {
      setOpenDialog(false);
    }
  }, [collectionName, token]);

  const handleNavigate = useCallback((action) => {
    handleMenuClose();
    onOptionClick(action, collectionName);
  }, [onOptionClick, collectionName]);

  return (
    <Card sx={{ width: '160px', height: '160px' }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" >
          <Grid item>
            <Typography style={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton aria-controls="collection-options-menu" aria-haspopup="true" onClick={handleMenuOpen}>
              <MoreVertOutlined />
            </IconButton>
          </Grid>


        </Grid>
        <Menu
          id="collection-options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigate('Edit')}>Edit</MenuItem>
          <MenuItem onClick={() => handleNavigate('Preview')}>Preview</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
      </CardContent>

      <ConfirmationDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </Card>
  );
});

export default CollectionCard;
