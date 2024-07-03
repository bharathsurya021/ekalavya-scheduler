import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Stack,
  Button,
} from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../utilities/DashboardCard';
import ScreenList from '../utilities/screen/ScreenList';
import ScreenFilter from '../utilities/screen/ScreenFilter';
import ScreenCreationModal from '../utilities/screen/ScreenCreationModal';

const screensData = [
  {
    id: 1,
    name: 'Screen 1',
    events: [
      { id: 1, title: 'File 1', startDate: '2024-07-02', endDate: '2024-08-28', startTime: '10:00', endTime: '12:00' },
      { id: 2, title: 'File 2', startDate: '2024-07-05', endDate: '2024-07-29', startTime: '14:00', endTime: '16:00' },
    ],
  },
  {
    id: 2,
    name: 'Screen 2',
    events: [
      { id: 3, title: 'File 3', startDate: '2024-06-30', endDate: '2024-06-30', startTime: '09:00', endTime: '10:00' },
      { id: 4, title: 'File 4', startDate: '2024-07-01', endDate: '2024-07-01', startTime: '11:00', endTime: '13:00' },
    ],
  },
];

const ScreenManager = () => {
  const [screens, setScreens] = useState(screensData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateScreenClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateScreen = (newScreen) => {
    setScreens([...screens, newScreen]);
    setIsModalOpen(false);
    // navigate('/scheduler', { state: { screen: newScreen } });
  };

  const handleViewScreen = (screen) => {
    // navigate('/scheduler', { state: { screen } });
    console.log('screen view clicked')
  };

  return (
    <PageContainer title="Screen manager" description="Manage your site screens">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard title="Screen Manager" subtitle="Manage your screens for your site.">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Stack direction={'row'} spacing={3} mb={3}>
                  <Button variant="contained" color="primary" onClick={handleCreateScreenClick}>
                    Create Screen
                  </Button>
                </Stack>
                <Typography>Screens</Typography>
                <ScreenFilter />
                <ScreenList screens={screens} onViewScreen={handleViewScreen} />
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
