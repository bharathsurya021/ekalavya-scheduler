import React from 'react';
import { Typography, Grid, Button, Stack } from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../utilities/DashboardCard';
import BlankCard from '../utilities/BlankCards';

const ContentManager = () => {
  return (
    <PageContainer
      title="Content manager"
      description="Manage your site content"
    >
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard
            title="Content Manager"
            subtitle=" Manage your collections for your site."
          >
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <Stack direction={'row'} spacing={3}>
                  <Button variant="contained" color="primary">
                    Create Collection
                  </Button>{' '}
                  <Button variant="contained" color="primary">
                    Create Folder
                  </Button>{' '}
                </Stack>
                <Grid container spacing={3}>
                  <Grid item sm={3}>
                    <BlankCard>collection 1</BlankCard>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ContentManager;
