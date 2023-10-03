import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Router from './routes';
import { baselightTheme } from './themes/DefaultColors';
function App() {
  const theme = baselightTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  );
}

export default App;
