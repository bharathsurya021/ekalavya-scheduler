import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

const CollectionCard = ({ title, onOptionClick }) => {
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
            aria-controls="collection-options-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertOutlined />
          </IconButton>
        </div>
        <Menu
          id="collection-options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => onOptionClick('Rename')}>Rename</MenuItem>
          <MenuItem onClick={() => onOptionClick('Edit')}>Edit</MenuItem>
          <MenuItem onClick={() => onOptionClick('Preview')}>Preview</MenuItem>
          <MenuItem onClick={() => onOptionClick('Delete')}>Delete</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
