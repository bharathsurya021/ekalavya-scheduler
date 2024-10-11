import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, CircularProgress, Alert, Box } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import ScreenList from '../components/screen/ScreenList';
import ScreenFilter from '../components/screen/ScreenFilter';
import useFetchScreens from '../hooks/useFetchScreens';
import { Add } from '@mui/icons-material';

const ScreenManager = () => {
  const { screens, loading, error } = useFetchScreens();
  const [filteredScreens, setFilteredScreens] = useState(screens);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredScreens(screens);
  }, [screens]);

  const handleCreateScreenClick = () => {
    navigate('/dashboard/screens/create');
  };

  const handleViewScreen = useCallback(
    (screen) => {
      navigate('/scheduler', { state: { screen } });
    },
    [navigate]
  );

  const handleFilterChange = useCallback(
    (filters) => {
      const filtered = screens.filter(
        (screen) =>
          screen.name.toLowerCase().includes(filters.searchText.toLowerCase()) &&
          screen.location.toLowerCase().includes(filters.filterLocation.toLowerCase()) &&
          screen.device_id.includes(filters.filterId)
      );
      setFilteredScreens(filtered);
    },
    [screens]
  );

  return (
    <DashboardLayout title="Screen Manager" subtitle="Manage your screens for your site.">
      <Stack direction="row" spacing={3} mb={3}>
        <Button variant="contained" color="primary" onClick={handleCreateScreenClick} startIcon={<Add />}>
          Add
        </Button>
      </Stack>
      <Stack spacing={3} mb={3}>
        <Typography>Screens</Typography>
        {loading ? (
          <CircularProgress /> // Show loading spinner
        ) : error ? (
          <Alert severity="error">Failed to fetch screens: {error.message}</Alert> // Show error message
        ) : (
          <Stack spacing={2} >
            <ScreenFilter onFilterChange={handleFilterChange} />
            <Box>
              <ScreenList screens={filteredScreens} onViewScreen={handleViewScreen} />
            </Box>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default ScreenManager;
