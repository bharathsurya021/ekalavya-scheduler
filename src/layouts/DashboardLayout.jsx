import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import DashboardCard from '../components/DashboardCard';

const DashboardLayout = ({ title, subtitle, children }) => {
  return (
    <PageContainer title={title} description={subtitle}>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard title={title} subtitle={subtitle}>
            {children}
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default DashboardLayout;
