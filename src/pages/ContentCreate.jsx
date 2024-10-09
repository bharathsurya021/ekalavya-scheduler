import React, { useState, useCallback, memo } from 'react';
import {
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
  Box,
  Grid,
  OutlinedInput,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { createCollection } from '../api/collections';
import { useAuth } from '../utilities/AuthContext';
import UseFetchScreens from '../hooks/useFetchScreens';

const TimeSlotInput = memo(({ startTime, endTime, onStartTimeChange, onEndTimeChange, onAddTimeSlot }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={5} >
      <TextField
        type="time"
        value={startTime}
        onChange={onStartTimeChange}
        fullWidth
        required
        inputProps={{ step: 300 }} // Allow for 5-minute intervals
      />
    </Grid>
    <Grid item xs={5}>
      <TextField
        type="time"
        value={endTime}
        onChange={onEndTimeChange}
        fullWidth
        required
        inputProps={{ step: 300 }} // Allow for 5-minute intervals
      />
    </Grid>
    <Grid item xs={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={onAddTimeSlot}
      >
        Add Time Slot
      </Button>
    </Grid>
  </Grid>
));

const DateRangeInput = memo(({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={6} >
      <TextField
        type="datetime-local"
        value={startDate}
        onChange={onStartDateChange}
        fullWidth
        required
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        type="datetime-local"
        value={endDate}
        onChange={onEndDateChange}
        fullWidth
        required
      />
    </Grid>
  </Grid>
));
const FileUpload = memo(({ uploadedFiles, onFileUpload, onDeleteFile }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="body2">Upload Files</Typography>
      <TextField
        accept="*"
        id="file-upload"
        sx={{ display: 'none' }}
        type="file"
        inputProps={{ multiple: true }}
        onChange={onFileUpload}
      />
      <Button sx={{ "width": "120px!important" }} variant="contained" component="label" htmlFor="file-upload">
        Choose Files
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {uploadedFiles.map((file) => (
          <Chip
            key={`${file.name}-${file.lastModified}`}
            label={file.name}
            onDelete={() => onDeleteFile(file)}
          />
        ))}
      </Box>
    </Stack>
  );
});

const CreateCollectionPage = () => {
  const [collectionName, setCollectionName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState('');
  const [dayOfYear, setDayOfYear] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [urlPaths, setUrlPaths] = useState([]);
  const { token } = useAuth();
  const { screens } = UseFetchScreens();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreateCollection = async () => {
    console.log('called the create function')
    // if (!collectionName || !frequency || !startDate || !endDate || timeSlots.length === 0) {
    //   setError('Collection Name, Frequency,Start Time,End Time, Start Date, and End Date are required!');
    //   return;
    // }



    const newCollection = {
      collection_name: collectionName,
      collection_id: collectionName,
      frequency,
      days_of_week: frequency === 'Weekly' ? daysOfWeek : undefined,
      day_of_month: frequency === 'Monthly' ? dayOfMonth : undefined,
      day_of_year: frequency === 'Yearly' ? dayOfYear : undefined,
      time_slots: timeSlots,
      alloted_devices: selectedDevices,
      url_paths: urlPaths,
    };
    console.log(newCollection)
    try {
      const response = await createCollection(newCollection, token);
      console.log('New Collection Created:', response.data);
      navigate('/content');
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };
  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newUrlPaths = files.map((file) => `${collectionName}/${file.name}`);
    setUploadedFiles((prev) => [...prev, ...files]);
    setUrlPaths((prev) => [...prev, ...newUrlPaths])
  }, [uploadedFiles, collectionName]);
  const handleDeleteFile = useCallback((fileToDelete) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileToDelete.name));
  }, [collectionName]);
  const handleDaysOfWeekChange = useCallback((event) => {
    const { target: { value } } = event;
    setDaysOfWeek(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleAddTimeSlot = useCallback(() => {
    if (!startTime || !endTime || !startDate || !endDate) {
      setError('Both Start Time, End Time, Start Date, and End Date are required!');
      return;
    }

    const newTimeSlot = {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      timeSlot: [
        {
          startTime,
          endTime
        }
      ]
    };

    // Assuming timeSlots is an array of objects with the specified format
    setTimeSlots((prev) => [...prev, newTimeSlot]);

    // Reset the input fields
    setStartTime('');
    setEndTime('');
    setStartDate(''); // Reset startDate if you are using a controlled input
    setEndDate(''); // Reset endDate if you are using a controlled input
    setError('');
  }, [startTime, endTime, startDate, endDate]);


  const handleDeviceChange = useCallback((event) => {
    const { target: { value } } = event;
    setSelectedDevices(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const resetForm = useCallback(() => {
    setCollectionName('');
    setFrequency('');
    setDaysOfWeek([]);
    setDayOfMonth('');
    setDayOfYear('');
    setTimeSlots([]);
    setStartTime('');
    setEndTime('');
    setStartDate('');
    setEndDate('');
    setError('');
    setSelectedDevices([]);
    setUploadedFiles([])
    setUrlPaths([])
  }, []);

  return (
    <DashboardLayout title="Create Collection" subtitle="Add a new collection for your content.">
      <Stack spacing={2} mb={3}>
        <TextField
          required
          label="Collection Name"
          value={collectionName}
          onChange={(e) => {
            setCollectionName(e.target.value);
            setError('');
          }}
          fullWidth
          error={!collectionName && !!error}
          helperText={!collectionName && !!error ? error : ''}
        />

        <FormControl fullWidth required error={!frequency && !!error}>
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            value={frequency}
            input={<OutlinedInput label="Frequency" />}
            onChange={(e) => {
              setFrequency(e.target.value);
              setError('');
              setDaysOfWeek([]);
              setDayOfMonth('');
              setDayOfYear('');
            }}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
          <Typography variant="caption" color="error">
            {!frequency && !!error ? error : ''}
          </Typography>
        </FormControl>

        {frequency === 'Weekly' && (
          <FormControl fullWidth>
            <InputLabel id="days-of-week-label">Days of the Week</InputLabel>
            <Select
              labelId="days-of-week-label"
              multiple
              value={daysOfWeek}
              onChange={handleDaysOfWeekChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {frequency === 'Monthly' && (
          <TextField
            required
            label="Day of the Month"
            type="number"
            value={dayOfMonth}
            onChange={(e) => {
              setDayOfMonth(e.target.value);
              setError('');
            }}
            fullWidth
            error={!dayOfMonth && !!error}
            helperText={!dayOfMonth && !!error ? error : ''}
          />
        )}

        {frequency === 'Yearly' && (
          <TextField
            required
            label="Day of the Year (MM-DD)"
            type="text"
            value={dayOfYear}
            onChange={(e) => {
              setDayOfYear(e.target.value);
              setError('');
            }}
            fullWidth
            error={!dayOfYear && !!error}
            helperText={!dayOfYear && !!error ? error : ''}
          />
        )}
        <Box>
          <Typography variant="body2">Start Date - End Date</Typography>

          <DateRangeInput
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(e) => {
              setStartDate(e.target.value);
              setError('');
            }}
            onEndDateChange={(e) => {
              setEndDate(e.target.value);
              setError('');
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2">Start Time - End Time (HH:MM)</Typography>
          <TimeSlotInput
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={(e) => {
              setStartTime(e.target.value);
              setError('');
            }}
            onEndTimeChange={(e) => {
              setEndTime(e.target.value);
              setError('');
            }}
            onAddTimeSlot={handleAddTimeSlot}
          />
          {timeSlots.length > 0 && (
            <Box>
              <Typography variant="body2">Added Time Slots:</Typography>
              {timeSlots.map((slot, index) => (
                <Typography key={index}>
                  {slot.startTime} - {slot.endTime}
                </Typography>
              ))}
            </Box>
          )}
        </Box>






        <FormControl fullWidth required error={!selectedDevices.length && !!error}>
          <InputLabel id="devices-label">Allotted Devices</InputLabel>
          <Select
            labelId="devices-label"
            multiple
            value={selectedDevices}
            input={<OutlinedInput label="Allotted Devices" />}
            onChange={handleDeviceChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {screens.map((screen) => (
              <MenuItem key={screen.device_id} value={screen.device_id}>
                {screen.name}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="error">
            {!selectedDevices.length && !!error ? error : ''}
          </Typography>
        </FormControl>

        <FileUpload
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onDeleteFile={handleDeleteFile}
        />
        <Grid container spacing={2} justifyContent="space-between" >
          <Grid item xs={6} sx={{ "paddingLeft": "0px !important" }}>
            <Button sx={{ width: '100%' }} variant="outlined" color="secondary" onClick={resetForm}>
              Clear
            </Button>
          </Grid>
          <Grid item xs={6} >
            <Button sx={{ width: '100%' }} variant="contained" color="primary" onClick={handleCreateCollection}>
              Create Collection
            </Button>
          </Grid>
        </Grid>

      </Stack>
    </DashboardLayout>
  );
};

export default CreateCollectionPage;
