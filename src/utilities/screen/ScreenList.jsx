import React from 'react';
import { Grid } from '@mui/material';
import ScreenCard from './ScreenCard';

const ScreenList = ({ screens, onViewScreen }) => {
  return (
    <Grid container spacing={2}>
      {screens.map((screen) => (
        <Grid item sm={3} key={screen.id}>
          <ScreenCard
            title={screen.name}
            id={screen.id}
            onOptionClick={(option) => {
              if (option === 'View' || option === 'Preview') {
                onViewScreen(screen);
              } else {
                console.log(`Option Clicked: ${option}`);
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ScreenList;
