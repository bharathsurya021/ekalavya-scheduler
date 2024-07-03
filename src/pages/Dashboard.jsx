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
      {
        id: 'event1-screen1',
        title: 'Meeting',
        start: '2024-07-05T10:00:00',
        end: '2024-07-05T11:00:00',
        rrule: 'FREQ=WEEKLY;BYDAY=TU,TH;COUNT=10' // Example of a recurring event every Tuesday and Thursday, 10 occurrences
      },
      {
        id: 'event2-screen1',
        title: 'Presentation',
        start: '2024-07-06T14:00:00',
        end: '2024-07-06T16:00:00',
        rrule: 'FREQ=MONTHLY;BYMONTHDAY=15;COUNT=5' // Example of a recurring event on the 15th of every month, 5 occurrences
      }
    ]
  },
  {
    id: 2,
    name: 'Screen 2',
    events: [
      {
        id: 'event1-screen2',
        title: 'Training',
        start: '2024-07-07T09:00:00',
        end: '2024-07-07T12:00:00',
        rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=8' // Example of a recurring event every Monday, Wednesday, and Friday, 8 occurrences
      },
      {
        id: 'event2-screen2',
        title: 'Team Lunch',
        start: '2024-07-08T12:00:00',
        end: '2024-07-08T13:00:00',
        rrule: 'FREQ=WEEKLY;BYDAY=FR;COUNT=12' // Example of a recurring event every Friday, 12 occurrences
      }
    ]
  }
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
    navigate('/scheduler', { state: { screen: newScreen } });
  };

  const handleViewScreen = (screen) => {
    navigate('/scheduler', { state: { screen } });
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
