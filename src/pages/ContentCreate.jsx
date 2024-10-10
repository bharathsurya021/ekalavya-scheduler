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
import { addFilesToCollections, createCollection } from '../api/collections';
import { useAuth } from '../utilities/AuthContext';
import useFetchScreens from '../hooks/useFetchScreens';

const TimeSlotInput = memo(({ startTime, endTime, onStartTimeChange, onEndTimeChange, onAddTimeSlot }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={5}>
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

const DateRangeInput = memo(({ startDate, endDate, onStartDateChange, onEndDateChange, error }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={6}>
      <TextField
        type="datetime-local"
        value={startDate}
        onChange={onStartDateChange}
        fullWidth
        required
        error={!!error.startDate}
        helperText={error.startDate}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        type="datetime-local"
        value={endDate}
        onChange={onEndDateChange}
        fullWidth
        required
        error={!!error.endDate}
        helperText={error.endDate}
      />
    </Grid>
  </Grid>
));

const FileUpload = memo(({ uploadedFiles, onFileUpload, onDeleteFile }) => (
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
));

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
  const { screens } = useFetchScreens();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!collectionName) newErrors.collectionName = "Collection Name is required";
    if (!frequency) newErrors.frequency = "Frequency is required";
    if (frequency === 'Weekly' && !daysOfWeek.length) newErrors.daysOfWeek = "At least one day of the week is required";
    if (frequency === 'Monthly' && !dayOfMonth) newErrors.dayOfMonth = "Day of the Month is required";
    if (frequency === 'Yearly' && !dayOfYear) newErrors.dayOfYear = "Day of the Year is required";
    if (!startDate) newErrors.startDate = "Start Date is required";
    if (!endDate) newErrors.endDate = "End Date is required";
    if (!timeSlots.length) newErrors.timeSlots = "At least one time slot is required";
    if (!selectedDevices.length) newErrors.selectedDevices = "At least one device must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCollection = async () => {
    if (!validateForm()) return;

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

    try {
      const response = await createCollection(newCollection, token);
      const uploadResponse = await addFilesToCollections(collectionName, uploadedFiles, token)
      navigate('/dashboard/content');
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newUrlPaths = files.map((file) => `${collectionName}/${file.name}`);
    setUploadedFiles((prev) => [...prev, ...files]);
    setUrlPaths((prev) => [...prev, ...newUrlPaths]);
  }, [collectionName]);

  const handleDeleteFile = useCallback((fileToDelete) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileToDelete.name));
  }, []);

  const handleDaysOfWeekChange = useCallback((event) => {
    const { target: { value } } = event;
    setDaysOfWeek(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleAddTimeSlot = useCallback(() => {
    if (!startTime || !endTime) {
      setErrors((prev) => ({ ...prev, timeSlots: 'Both Start Time and End Time are required!' }));
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

    setTimeSlots((prev) => [...prev, newTimeSlot]);
    setErrors((prev) => ({ ...prev, timeSlots: undefined }));
  }, [startTime, endTime, startDate, endDate]);
  const handleDeleteTimeSlot = useCallback((slotIndex, timeIndex) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) => {
        if (i === slotIndex) {
          // Remove the specific time slot
          return {
            ...slot,
            timeSlot: slot.timeSlot.filter((_, j) => j !== timeIndex),
          };
        }
        return slot;
      })
    );
  }, [timeSlots]);

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
    setErrors({});
    setSelectedDevices([]);
    setUploadedFiles([]);
    setUrlPaths([]);
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
            setErrors((prev) => ({ ...prev, collectionName: undefined }));
          }}
          error={!!errors.collectionName}
          helperText={errors.collectionName}
        />
        <FormControl required error={!!errors.frequency}>
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            value={frequency}
            input={<OutlinedInput label={"Frequency"} />}
            onChange={(e) => {
              setFrequency(e.target.value);
              setErrors((prev) => ({ ...prev, frequency: undefined }));
            }}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
          {errors.frequency && <span style={{ color: 'red' }}>{errors.frequency}</span>}
        </FormControl>

        {frequency === 'Weekly' && (
          <FormControl required error={!!errors.daysOfWeek}>
            <InputLabel id="daysOfWeek-label">Days of Week</InputLabel>
            <Select
              required
              labelId="daysOfWeek-label"
              multiple
              value={daysOfWeek}
              input={<OutlinedInput label={"Days of Week"} />}
              onChange={handleDaysOfWeekChange}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
            {errors.daysOfWeek && <span style={{ color: 'red' }}>{errors.daysOfWeek}</span>}
          </FormControl>
        )}

        {frequency === 'Monthly' && (
          <TextField
            required
            label="Day of the Month (DD)"
            value={dayOfMonth}
            onChange={(e) => {
              setDayOfMonth(e.target.value);
              setErrors((prev) => ({ ...prev, dayOfMonth: undefined }));
            }}
            error={!!errors.dayOfMonth}
            helperText={errors.dayOfMonth}
          />
        )}

        {frequency === 'Yearly' && (
          <TextField
            required
            label="Day of the Year (MM:DD)"
            value={dayOfYear}
            onChange={(e) => {
              setDayOfYear(e.target.value);
              setErrors((prev) => ({ ...prev, dayOfYear: undefined }));
            }}
            error={!!errors.dayOfYear}
            helperText={errors.dayOfYear}
          />
        )}
        <Box>

          <Typography variant="body2">Start Date - End Date</Typography>

          <DateRangeInput
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(e) => {
              setStartDate(e.target.value);
              setErrors((prev) => ({ ...prev, startDate: undefined }));
            }}
            onEndDateChange={(e) => {
              setEndDate(e.target.value);
              setErrors((prev) => ({ ...prev, endDate: undefined }));
            }}
            error={errors}
          />
        </Box>

        <Box>

          <Typography variant="body2">Start Time - End Time (HH:MM)</Typography>

          <TimeSlotInput
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={(e) => {
              setStartTime(e.target.value);
              setErrors((prev) => ({ ...prev, timeSlots: undefined }));
            }}
            onEndTimeChange={(e) => {
              setEndTime(e.target.value);
              setErrors((prev) => ({ ...prev, timeSlots: undefined }));
            }}
            onAddTimeSlot={handleAddTimeSlot}
          />
          {errors.timeSlots && <span style={{ color: 'red' }}>{errors.timeSlots}</span>}

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            {timeSlots.map((slot, index) => (
              <Box key={index}>
                {/* <Typography variant="body2">
                  Start Date: {new Date(slot.startDate).toLocaleDateString()} - End Date: {new Date(slot.endDate).toLocaleDateString()}
                </Typography> */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {slot.timeSlot.map((time, timeIndex) => (
                    <Chip
                      key={timeIndex}
                      label={`${time.startTime} - ${time.endTime}`}
                      onDelete={() => handleDeleteTimeSlot(index, timeIndex)}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

        </Box>

        <FileUpload
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onDeleteFile={handleDeleteFile}
        />

        <FormControl required error={!!errors.selectedDevices}>
          <InputLabel id="devices-label">Allotted Devices</InputLabel>
          <Select
            labelId="devices-label"
            multiple
            input={<OutlinedInput label={"Allotted Devices"} />}
            value={selectedDevices}
            onChange={handleDeviceChange}
          >
            {screens.map(screen => (
              <MenuItem key={screen.device_id} value={screen.device_id}>{screen.name}</MenuItem>
            ))}
          </Select>
          {errors.selectedDevices && <span style={{ color: 'red' }}>{errors.selectedDevices}</span>}
        </FormControl>

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
