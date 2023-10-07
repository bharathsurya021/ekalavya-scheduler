import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../utilities/DashboardCard';
import ScreenList from '../utilities/screen/ScreenList';
import ScreenFilter from '../utilities/screen/ScreenFilter';
import ScreenCreationModal from '../utilities/screen/ScreenCreationModal';

const ScreenManager = () => {
  const [screens, setScreens] = useState([]);
  const [isCreatingScreen, setIsCreatingScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateScreenClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateScreen = (newScreen) => {
    setScreens([...screens, newScreen]);
    setIsModalOpen(false);
  };

  return (
    <PageContainer
      title="Screen manager"
      description="Manage your site screens"
    >
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard
            title="Screen Manager"
            subtitle="Manage your screens for your site."
          >
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Stack direction={'row'} spacing={3} mb={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateScreenClick}
                  >
                    Create Screen
                  </Button>
                </Stack>
                <Typography>Screens</Typography>
                <ScreenFilter />
                <ScreenList screens={screens} />
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
      <ScreenCreationModal
        open={isModalOpen}
        onClose={handleModalClose}
        onCreateScreen={handleCreateScreen}
      />
    </PageContainer>
  );
};

export default ScreenManager;
