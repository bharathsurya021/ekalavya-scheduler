import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { LinearScaleOutlined } from '@mui/icons-material';

const ScreenCard = ({ title, id, onOptionClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: '160px', height: '160px' }}>
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton
            aria-controls="screen-options-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <LinearScaleOutlined />
          </IconButton>
        </div>
        <Menu
          id="screen-options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onOptionClick('View'); handleMenuClose(); }}>View</MenuItem>
          <MenuItem onClick={() => { onOptionClick('Rename'); handleMenuClose(); }}>Rename</MenuItem>
          <MenuItem onClick={() => { onOptionClick('Edit'); handleMenuClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { onOptionClick('Preview'); handleMenuClose(); }}>Preview</MenuItem>
          <MenuItem onClick={() => { onOptionClick('Delete'); handleMenuClose(); }}>Delete</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ScreenCard;
