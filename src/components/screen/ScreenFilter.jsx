import React, { useState } from 'react';
import { TextField, Stack } from '@mui/material';

const ScreenFilter = ({ onFilterChange }) => {
  const [searchText, setSearchText] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterId, setFilterId] = useState('');

  const handleSearchTextChange = (e) => {
    const newValue = e.target.value;
    setSearchText(newValue);
    onFilterChange({ searchText: newValue, filterLocation, filterId });
  };

  const handleFilterLocationChange = (e) => {
    const newValue = e.target.value;
    setFilterLocation(newValue);
    onFilterChange({ searchText, filterLocation: newValue, filterId });
  };

  const handleFilterIdChange = (e) => {
    const newValue = e.target.value;
    setFilterId(newValue);
    onFilterChange({ searchText, filterLocation, filterId: newValue });
  };

  return (
    <Stack spacing={3} direction="row">
      <TextField
        label="Search"
        value={searchText}
        onChange={handleSearchTextChange}
      />
      <TextField
        label="Filter by Location"
        value={filterLocation}
        onChange={handleFilterLocationChange}
      />
      <TextField
        label="Filter by ID"
        value={filterId}
        onChange={handleFilterIdChange}
      />
    </Stack>
  );
};

export default ScreenFilter;
