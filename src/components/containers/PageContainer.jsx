import { Box } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet';

const PageContainer = ({ title, description, children }) => (
  <Box>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </Box>
);

export default PageContainer;
