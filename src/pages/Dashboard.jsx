import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Stack, Button } from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../utilities/DashboardCard';
import ScreenList from '../utilities/screen/ScreenList';
import ScreenFilter from '../utilities/screen/ScreenFilter';
import ScreenCreationModal from '../utilities/screen/ScreenCreationModal';
import UseFetchScreens from '../hooks/useFetchScreens';

const ScreenManager = () => {
  const { screens, addScreen } = UseFetchScreens();
  const [filteredScreens, setFilteredScreens] = useState(screens);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setFilteredScreens(screens);
  }, [screens]);

  const handleCreateScreenClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateScreen = useCallback(
    (newScreen) => {
      addScreen(newScreen);
      setIsModalOpen(false);
      navigate('/scheduler', { state: { screen: newScreen } });
    },
    [addScreen, navigate]
  );

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
    <PageContainer title="Screen Manager" description="Manage your site screens">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard title="Screen Manager" subtitle="Manage your screens for your site.">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Stack direction="row" spacing={3} mb={3}>
                  <Button variant="contained" color="primary" onClick={handleCreateScreenClick}>
                    Create Screen
                  </Button>
                </Stack>
                <Stack spacing={3} mb={3} >
                  <Typography>Screens</Typography>
                  <ScreenFilter onFilterChange={handleFilterChange} />
                  <ScreenList screens={filteredScreens} onViewScreen={handleViewScreen} />
                </Stack>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
      <ScreenCreationModal open={isModalOpen} onClose={handleModalClose} onCreateScreen={handleCreateScreen} />
    </PageContainer>
  );
};

export default ScreenManager;
