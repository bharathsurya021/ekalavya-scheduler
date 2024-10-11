import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { createDevice } from '../api/devices';
import { useAuth } from '../components/AuthContext';

const CreateScreen = () => {
  const [screenName, setScreenName] = useState('UnTitled');
  const [location, setLocation] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreateScreen = async () => {
    if (!screenName || !location || !deviceId) {
      setError('All fields are required!');
      return;
    }

    const newScreen = {
      device_id: deviceId,
      name: screenName,
      location: location,
      restricted_time_slots: [],
    };

    try {
      const response = await createDevice(newScreen, token);
      navigate('/dashboard/screens');
    } catch (error) {
      console.error('Failed to create screen:', error);
    }
  };

  return (
    <DashboardLayout title="Create Screen" subtitle="Add a new screen for your site.">
      <Stack direction={"row"} spacing={3} mb={3}>
        <TextField
          required
          label="Screen Name"
          value={screenName}
          onChange={(e) => {
            setScreenName(e.target.value);
            setError('');
          }}
          fullWidth
          error={!screenName && !!error}
          helperText={!screenName && !!error ? error : ''}
        />
        <TextField
          required
          label="Device ID"
          value={deviceId}
          onChange={(e) => {
            setDeviceId(e.target.value);
            setError('');
          }}
          fullWidth
          error={!deviceId && !!error}
          helperText={!deviceId && !!error ? error : ''}
        />
        <TextField
          required
          label="Location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setError('');
          }}
          fullWidth
          error={!location && !!error}
          helperText={!location && !!error ? error : ''}
        />
      </Stack>
      <Button variant="contained" color="primary" onClick={handleCreateScreen}>
        Create Screen
      </Button>
    </DashboardLayout>
  );
};

export default CreateScreen;
