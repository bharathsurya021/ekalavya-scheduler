import React, { useEffect, useState } from 'react';
import { styled, Container, Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const PrivateLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  const storedPath = sessionStorage.getItem('currentPath');

  useEffect(() => {
    if (initialLoad) {
      if (storedPath && storedPath !== location.pathname) {
        navigate(storedPath);
      }
      setInitialLoad(false);
    }
  }, [navigate, storedPath, initialLoad, location.pathname]);

  useEffect(() => {
    sessionStorage.setItem('currentPath', location.pathname);
  }, [location.pathname]);
  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper className="page-wrapper">
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <Container
          sx={{
            paddingTop: '20px',
            maxWidth: '1200px',
          }}
        >
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default PrivateLayout;
