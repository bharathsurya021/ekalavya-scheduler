import React, { useState, useCallback, memo, useEffect } from 'react';
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { addFilesToCollections, createCollection, deleteFileFromCollection } from '../api/collections';
import { useAuth } from '../components/AuthContext';
import useFetchScreens from '../hooks/useFetchScreens';
import useFetchCollectionById from '../hooks/useFetchCollection';

const TimeSlotInput = memo(({ isDisabled, startTime, endTime, onStartTimeChange, onEndTimeChange, onAddTimeSlot }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={5}>
      <TextField
        type="time"
        value={startTime}
        onChange={onStartTimeChange}
        InputProps={{ readOnly: isDisabled }}
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
        InputProps={{ readOnly: isDisabled }}
        fullWidth
        required
        inputProps={{ step: 300 }} // Allow for 5-minute intervals
      />
    </Grid>
    <Grid item xs={2}>
      <Button
        disabled={!startTime || !endTime}
        variant="contained"
        color="primary"
        onClick={onAddTimeSlot}
      >
        Add Time Slot
      </Button>
    </Grid>
  </Grid>
));

const DateRangeInput = memo(({ startDate, endDate, onStartDateChange, onEndDateChange, error, isDisabled }) => (
  <Grid container spacing={2} alignItems={"center"} sx={{ marginTop: "0px!important" }}>
    <Grid item xs={6}>
      <TextField
        type="datetime-local"
        value={startDate}
        onChange={onStartDateChange}
        InputProps={{ readOnly: isDisabled }}
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
        InputProps={{ readOnly: isDisabled }}
        fullWidth
        required
        error={!!error.endDate}
        helperText={error.endDate}
      />
    </Grid>
  </Grid>
));

const FileUpload = memo(({ uploadedFiles, uploadNewFiles, onFileUpload, onDeleteFileUpload, onDeleteFileUploaded, collectionName, token, isDisabled }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      try {
        const fileName = fileToDelete.name.split("/")[1];
        await deleteFileFromCollection(collectionName, fileName, token);
        // Update the uploadedFiles in the parent component
        onDeleteFileUploaded(fileToDelete);
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
      setFileToDelete(null);
    }
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setFileToDelete(null);
    setOpenDialog(false);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2">Uploaded Files</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploadedFiles.map((file) => (
              <TableRow key={`${file.name}-${file.lastModified}`}>
                <TableCell>{file.name}</TableCell>
                <TableCell>
                  <Button disabled={isDisabled} variant="outlined" color="error" onClick={() => handleDeleteClick(file)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isDisabled && (<>
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

        {uploadNewFiles.length > 0 &&
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {uploadNewFiles.map((file) => (
              <Chip
                key={`${file.name}-${file.lastModified}`}
                label={file.name}
                onDelete={() => onDeleteFileUpload(file)}
              />
            ))}
          </Box>
        }
      </>
      )}


      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file: {fileToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
});


const EditCollection = () => {
  const { collectionName: id } = useParams();
  const location = useLocation()
  const pathSegments = location.pathname.split('/');
  const editSegment = pathSegments.includes('edit')
  const viewSegment = pathSegments.includes('view')
  const { token } = useAuth();
  const { collection, loading, error } = useFetchCollectionById(id, token)
  const { screens } = useFetchScreens();
  const navigate = useNavigate();

  const [collectionName, setCollectionName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState('');
  const [dayOfYear, setDayOfYear] = useState('');
  const [timeSlots, setTimeSlots] = useState({});
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [urlPaths, setUrlPaths] = useState([]);
  const [newUrlPaths, setNewUrlPaths] = useState([]);
  const [errors, setErrors] = useState({});

  const formatDateToDatetimeLocal = (dateInput) => {
    // Convert to Date object if input is a string
    const date = new Date(dateInput)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Handle invalid date
    }

    const padToTwoDigits = (num) => (num < 10 ? `0${num}` : num);

    const year = date.getFullYear();
    const month = padToTwoDigits(date.getMonth() + 1); // Months are zero-based
    const day = padToTwoDigits(date.getDate());
    const hours = padToTwoDigits(date.getHours());
    const minutes = padToTwoDigits(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const validateForm = () => {
    const newErrors = {};
    if (!collectionName) newErrors.collectionName = "Collection Name is required";
    if (!frequency) newErrors.frequency = "Frequency is required";
    if (frequency === 'Weekly' && !daysOfWeek.length) newErrors.daysOfWeek = "At least one day of the week is required";
    if (frequency === 'Monthly' && !dayOfMonth) newErrors.dayOfMonth = "Day of the Month is required";
    if (frequency === 'Yearly' && !dayOfYear) newErrors.dayOfYear = "Day of the Year is required";
    if (!startDate) newErrors.startDate = "Start Date is required";
    if (!endDate) newErrors.endDate = "End Date is required";
    if (!timeSlots?.timeSlot?.length) newErrors.timeSlots = "At least one time slot is required";
    if (!selectedDevices.length) newErrors.selectedDevices = "At least one device must be selected";
    // if (!checkValidFileName(uploadedFiles, uploadFiles)) newErrors.fileUpload = "Try uploading file with different filename since its already exists"
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkValidFileName = (files) => {
    const cleanFileNameFromUploadedFiles = uploadedFiles.map((file) => file.name.split("/")[1])
    const isFileNameExists = files.some((file) => cleanFileNameFromUploadedFiles.includes(file.name))
    return isFileNameExists;
  }

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
    if (!loading) {
      setCollectionName(collection?.collection_name || '');
      setFrequency(collection?.frequency || '');
      setDaysOfWeek(collection?.days_of_week || []);
      setDayOfMonth(collection?.day_of_month || '');
      setDayOfYear(collection?.day_of_year || '');
      setTimeSlots(collection?.time_slots || []);
      setStartDate(formatDateToDatetimeLocal(collection?.time_slots.startDate) || '');
      setEndDate(formatDateToDatetimeLocal(collection?.time_slots.endDate) || '');
      setSelectedDevices(collection?.alloted_devices || []);
      setUploadedFiles(collection?.url_paths?.map((path) => ({ name: path })) || []);
      setUrlPaths(collection?.url_paths || [])
    }

  }, [loading, token]);


  const handleCreateCollection = async () => {
    if (!validateForm()) return;
    const updatedUrlPaths = [...urlPaths, ...newUrlPaths];
    const newCollection = {
      collection_name: collectionName,
      collection_id: collectionName,
      frequency,
      days_of_week: frequency === 'Weekly' ? daysOfWeek : undefined,
      day_of_month: frequency === 'Monthly' ? dayOfMonth : undefined,
      day_of_year: frequency === 'Yearly' ? dayOfYear : undefined,
      time_slots: timeSlots,
      alloted_devices: selectedDevices,
      url_paths: updatedUrlPaths,
    };
    try {
      const response = await createCollection(newCollection, token);
      if (newUrlPaths.length > 0) {
        const uploadResponse = await addFilesToCollections(collectionName, uploadFiles, token)
      }
      navigate('/dashboard/content');
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    if (checkValidFileName(files)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fileUpload: 'Try uploading file with different filename since its already exists.',
      }));

      return
    }
    const currUrlPaths = files.map((file) => `${collectionName}/${file.name}`);
    setUploadFiles((prev) => [...prev, ...files]);
    setNewUrlPaths((prev) => [...prev, ...currUrlPaths]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fileUpload: undefined,
    }));

  }, [uploadFiles, collectionName]);

  const handleDeleteFileFromUploaded = useCallback((fileToDelete) => {
    setUploadedFiles((prev) => prev.filter(file => file.name !== fileToDelete.name));

    setUrlPaths((prev) => {
      const updatedPaths = prev.filter(file => {
        return file !== fileToDelete.name
      })
      return updatedPaths;
    });
  }, []);
  const handleDeleteFileFromUpload = useCallback((fileToDelete) => {
    setUploadFiles((prev) => prev.filter(file => file.name !== fileToDelete.name));
    setNewUrlPaths((prev) => prev.filter(file => file.split("/")[1] !== fileToDelete.name));
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
      startTime,
      endTime,
    };

    setTimeSlots((prev) => {
      const timeSlotsArray = Array.isArray(prev.timeSlot) ? prev.timeSlot : [];

      return {
        ...prev,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        timeSlot: [...timeSlotsArray, newTimeSlot],
      };
    });

    setErrors((prev) => ({ ...prev, timeSlots: undefined }));
  }, [startTime, endTime, startDate, endDate]);

  const handleDeleteTimeSlot = useCallback((timeSlotIndex) => {
    setTimeSlots((prev) => {
      const { startDate, endDate, timeSlot } = prev
      const updatedTimeSlot = timeSlot.filter((_, index) => index !== timeSlotIndex);
      return {
        startDate,
        endDate,
        timeSlot: updatedTimeSlot,
      };
    });
  }, []);


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
    setUploadFiles([]);
    setNewUrlPaths([]);
  }, []);
  return (
    <DashboardLayout title={viewSegment ? "View Collection" : "Edit Collection"} subtitle={viewSegment ? "View collection content." : "Edit collection for your content."}>
      <Stack spacing={2} mb={3}>
        <TextField
          required
          inputProps={{ readOnly: viewSegment, }}
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
            inputProps={{ readOnly: viewSegment, }}
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
              inputProps={{ readOnly: viewSegment, }}
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
            inputProps={{ readOnly: viewSegment, }}
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
            inputProps={{ readOnly: viewSegment, }}
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
            isDisabled={viewSegment}
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
            isDisabled={viewSegment}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {timeSlots?.timeSlot?.map((time, timeIndex) => (
                viewSegment ? (
                  <Box
                    key={timeIndex}
                    sx={{
                      border: '1px solid',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      borderRadius: 1,
                      padding: '8px',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <Typography variant="body2">
                      {`${time.startTime} - ${time.endTime}`}
                    </Typography>
                  </Box>
                ) : (
                  <Chip
                    key={timeIndex}
                    label={`${time.startTime} - ${time.endTime}`}
                    onDelete={() => handleDeleteTimeSlot(timeIndex)}
                    variant="outlined"
                    color="primary"
                  />
                )

              ))}
            </Box>
          </Box>

        </Box>

        <FileUpload
          isDisabled={viewSegment}
          uploadedFiles={uploadedFiles}
          uploadNewFiles={uploadFiles}
          onFileUpload={handleFileUpload}
          onDeleteFileUploaded={handleDeleteFileFromUploaded}
          onDeleteFileUpload={handleDeleteFileFromUpload}
          collectionName={collectionName}
          token={token}
        />
        {errors.fileUpload && <span style={{ color: 'red' }}>{errors.fileUpload}</span>}

        <FormControl required error={!!errors.selectedDevices}>
          <InputLabel id="devices-label">Allotted Devices</InputLabel>
          <Select
            labelId="devices-label"
            multiple
            input={<OutlinedInput label={"Allotted Devices"} />}
            inputProps={{ readOnly: viewSegment, }}
            value={selectedDevices}
            onChange={handleDeviceChange}
          >
            {screens.map(screen => (
              <MenuItem key={screen.device_id} value={screen.device_id}>{screen.name}</MenuItem>
            ))}
          </Select>
          {errors.selectedDevices && <span style={{ color: 'red' }}>{errors.selectedDevices}</span>}
        </FormControl>
        {editSegment && (
          <Grid container spacing={2} justifyContent="space-between" >
            <Grid item xs={6} sx={{ "paddingLeft": "0px !important" }}>
              <Button sx={{ width: '100%' }} variant="outlined" color="secondary" onClick={resetForm}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={6} >
              <Button sx={{ width: '100%' }} variant="contained" color="primary" onClick={handleCreateCollection}>
                Save
              </Button>
            </Grid>
          </Grid>
        )}

      </Stack>
    </DashboardLayout>
  );
};

export default EditCollection;
