import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Grid } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

const ScreenCard = ({ title, id, onOptionClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: '160px', height: '160px' }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <Typography noWrap>
              {title}
            </Typography>
          </Grid>
          {/* <Grid item>
            <IconButton
              aria-controls="screen-options-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MoreVertOutlined />
            </IconButton>
          </Grid> */}
        </Grid>
        <Menu
          id="screen-options-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {['Preview'].map((option) => (
            <MenuItem key={option} onClick={() => { onOptionClick(option); handleMenuClose(); }}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ScreenCard;
