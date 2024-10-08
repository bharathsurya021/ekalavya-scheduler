import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

const ScreenFilter = ({ onFilterChange }) => {
  const [searchText, setSearchText] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterId, setFilterId] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ searchText, filterLocation, filterId });
  };

  return (
    <Stack spacing={3} direction="row">
      <TextField label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
      <TextField label="Filter by Location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
      <TextField label="Filter by ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} />
      <Button onClick={handleFilterChange} color="primary">Apply Filters</Button>
    </Stack>
  );
};

export default ScreenFilter;
