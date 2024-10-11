import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';

const EventFilters = ({ collections, devices, selectedCollection, selectedDevice, onCollectionChange, onDeviceChange }) => {
  return (
    <Stack direction="row" spacing={3} mb={3}>
      <FormControl fullWidth>
        <InputLabel>Collection</InputLabel>
        <Select value={selectedCollection} onChange={onCollectionChange}>
          <MenuItem value="">All Collections</MenuItem>
          {collections.map((collection) => (
            <MenuItem key={collection} value={collection}>
              {collection}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Device</InputLabel>
        <Select value={selectedDevice} onChange={onDeviceChange}>
          <MenuItem value="">All Devices</MenuItem>
          {devices.map((device) => (
            <MenuItem key={device} value={device}>
              {device}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default EventFilters;
