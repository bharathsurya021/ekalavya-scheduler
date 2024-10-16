import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  ButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { ChevronLeft, ChevronRight, CloseOutlined } from '@mui/icons-material';
import useTransformEvents from './useTransformEvents';
dayjs.extend(advancedFormat);

const CalendarHeader = ({ currentDate, onPrev, onNext, onToggleView, view }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
      {/* <ButtonGroup variant="contained" aria-label="outlined primary button group"> */}
      <Button variant="contained" onClick={onPrev}>
        <ChevronLeft />
      </Button>
      {/* </ButtonGroup> */}
      <Typography variant="h4" align="center">
        {view === 'day' ? `${currentDate.format('MMMM D, YYYY')}` :
          view === 'week' ? `${currentDate.format('MMMM YYYY')}` :
            `${currentDate.format('MMMM YYYY')}`}
      </Typography>

      {/* <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => onToggleView('month')} variant={view === 'month' ? 'contained' : 'outlined'}>Month </Button>
        <Button onClick={() => onToggleView('week')} variant={view === 'week' ? 'contained' : 'outlined'}>Week</Button>
        <Button onClick={() => onToggleView('day')} variant={view === 'day' ? 'contained' : 'outlined'}>Day</Button>
      </ButtonGroup> */}

      <Button variant="contained" onClick={onNext}>
        <ChevronRight />
      </Button>

    </Box>
  );
};

const EventDialog = React.memo(({ event, open, onClose }) => {
  console.log(event, 'dialog')
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Event Details</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseOutlined />
      </IconButton>
      <DialogContent dividers>
        {event && (
          <>
            <Typography variant="subtitle1"><strong>Collection ID:</strong> {event.collection_id}</Typography>
            <Typography variant="subtitle2"><strong>Date:</strong> {dayjs(event.startDate).format('MMMM D, YYYY')}</Typography>
            <Typography variant="subtitle2"><strong>Time:</strong> {event.startTime} - {event.endTime}</Typography>
            <Typography variant="subtitle2"><strong>Allotted Devices:</strong> {event.alloted_devices.join(', ')}</Typography>
          </>
        )}
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions> */}
    </Dialog>
  )
});


const EventCell = React.memo(({ event, color, onClick }) => (
  <Box
    onClick={() => onClick(event)}
    sx={{
      minHeight: '32px',
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '4px',
      padding: '2px 4px',
      marginTop: '4px',
      fontSize: '12px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    }}
  >
    {`${event.startTime} - ${event.endTime}`}
  </Box>
));


const DayView = ({ currentDate, events }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const currentDay = dayjs(currentDate).date()
  const timeSlots = [
    'All Day',
    ...Array.from({ length: 24 }, (_, i) => `${i}:00`),
  ];

  const handleAddEvent = (time) => {
    setSelectedTime(time);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventTitle('');
  };

  const handleSaveEvent = () => {
    handleDialogClose();
  };

  return (
    <Box>
      <Table>
        <TableBody>
          {timeSlots.map((time, index) => (
            <TableRow
              key={index}
              sx={{ height: '60px' }}
            >
              <TableCell sx={{ width: '120px', border: '1px solid #ddd' }}>
                <Typography variant="body1" align='center' >{time}</Typography>
              </TableCell>
              <TableCell sx={{
                border: '1px solid #ddd', cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#ECF2FF',
                },
              }} >
                <Box>
                  {events
                    .filter((event) => {
                      const { startTime, endTime, day } = event
                      const isSameDay = day === currentDay
                      // Check if the event falls within the specified time slot
                      const isWithinTimeSlot =
                        time !== 'All Day' && (
                          (startTime === time) || // Starts at the exact time
                          (endTime === time) ||   // Ends at the exact time
                          (startTime < time && endTime > time) // Event spans the time
                        );

                      // Return true if it's the same day and within the time slot
                      return isSameDay && (isWithinTimeSlot);
                    })
                    .map((event, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          height: '16px',
                          backgroundColor: '#1976d2',
                          color: '#fff',
                          padding: '2px 5px',
                          margin: '2px 0',
                        }}
                      >
                        {event.title}
                      </Box>
                    ))}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEvent}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const MonthGrid = ({ daysArray, events, currentDate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const darkColors = useMemo(() => [
    '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E', '#1976D2', '#1565C0', '#0D47A1',
    '#7C4DFF', '#651FFF', '#6200EA', '#304FFE', '#00796B', '#00695C', '#004D40', '#8D6E63', '#795548',
    '#6D4C41', '#5D4037', '#4E342E', '#3E2723', '#757575', '#616161', '#424242', '#212121', '#546E7A',
    '#455A64', '#37474F', '#263238',
  ], []);

  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      weeksArray.push(daysArray.slice(i, i + 7));
    }
    return weeksArray;
  }, [daysArray]);

  const currentYear = dayjs(currentDate).year();
  const currentMonth = dayjs(currentDate).month() + 1;

  const eventsForCurrentMonth = useMemo(() => events.filter(event => (
    event.year === currentYear && event.month === currentMonth
  )), [events, currentYear, currentMonth]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedEvent(null);
  }, []);

  return (
    <>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <TableCell key={day} align="center" size="medium" sx={{ border: '1px solid #ddd' }}>
                  <Typography variant="h6">{day}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week, rowIndex) => (
              <TableRow key={rowIndex}>
                {week.map(({ day, isCurrentMonth }, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    align="center"
                    sx={{
                      minWidth: '100px',
                      width: 'auto',
                      height: '120px',
                      padding: '8px',
                      position: 'relative',
                      backgroundColor: isCurrentMonth ? 'inherit' : '#f0f0f0',
                      border: '1px solid #ddd',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: isCurrentMonth ? 'black' : 'gray',
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                      }}
                    >
                      {day}
                    </Typography>

                    {eventsForCurrentMonth.map((event, index) => (
                      event.day === day && (
                        <EventCell
                          key={event.id}
                          event={event}
                          color={darkColors[index % darkColors.length]}
                          onClick={handleEventClick}
                        />
                      )
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EventDialog event={selectedEvent} open={openDialog} onClose={handleCloseDialog} />
    </>
  );
};
const WeekView = ({ events }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [eventTitle, setEventTitle] = useState('');

  const timeSlots = ['All Day', ...Array.from({ length: 24 }, (_, i) => `${i}:00`)];

  const firstHour = events[0].start.hour()
  const handleAddEvent = (time, day) => {
    setSelectedTime(time);
    setOpenDialog(true);
    setEventTitle('');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEventTitle('');
  };

  const handleSaveEvent = (day) => {
    handleDialogClose();
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: '100px', width: '100px', border: '1px solid #ddd' }}  ></TableCell>
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const day = startOfWeek.add(dayIndex, 'day');
              return (
                <TableCell key={dayIndex} align="center" sx={{ minWidth: '100px', border: '1px solid #ddd' }}>
                  <Typography variant="subtitle2">
                    {day.format('ddd')}
                  </Typography>
                  <Typography variant="h3">
                    {day.format('DD')}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((time, index) => (
            <TableRow key={index} sx={{ height: '60px' }}>
              <TableCell align="center" sx={{ border: '1px solid #ddd' }} >
                <Typography variant="body2">{time}</Typography>
              </TableCell>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = startOfWeek.add(dayIndex, 'day');

                return (
                  <TableCell
                    key={dayIndex}
                    onClick={() => time !== 'All Day' && handleAddEvent(time, day.format('YYYY-MM-DD'))}
                    sx={{
                      cursor: 'pointer', border: '1px solid #ddd', position: 'relative',
                      '&:hover': {
                        backgroundColor: '#ECF2FF',
                      },
                    }}
                  >
                    {events
                      .filter(event => {
                        const eventStart = event.start
                        const eventEnd = event.end
                        const eventHour = eventStart.hour();

                        return (
                          (eventStart.isSame(day, 'day') && `0${eventHour}:00` === time) ||
                          (eventEnd.isSame(day, 'day') && `0${eventHour}:00` === time) ||
                          (eventStart.isAfter(startOfWeek) && eventStart.isBefore(endOfWeek)) ||
                          (eventEnd.isAfter(startOfWeek) && eventEnd.isBefore(endOfWeek))
                        );
                      })
                      .map((event, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            padding: '2px 5px',
                            margin: '2px 0',
                          }}
                        >
                          {event.title}
                        </Box>
                      ))}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => handleSaveEvent(selectedTime)}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

const Calendar = ({ events }) => {
  const formattedEvents = useTransformEvents(events)
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState('month');

  const getDaysArray = () => {
    const daysArray = [];
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const daysInMonth = currentDate.daysInMonth();

    const prevMonthDays = startOfMonth.day();
    const lastDayOfPrevMonth = startOfMonth.subtract(1, 'month').daysInMonth();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      daysArray.push({ day: lastDayOfPrevMonth - i, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, isCurrentMonth: true });
    }

    const nextMonthDays = 42 - daysArray.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      daysArray.push({ day: i, isCurrentMonth: false });
    }

    return daysArray;
  };

  const daysArray = getDaysArray();

  const handlePrev = () => {
    switch (view) {
      case 'day':
        setCurrentDate(currentDate.subtract(1, 'day'));
        break;
      case 'week':
        setCurrentDate(currentDate.subtract(1, 'week'));
        break;
      case 'month':
        setCurrentDate(currentDate.subtract(1, 'month'));
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        setCurrentDate(currentDate.add(1, 'day'));
        break;
      case 'week':
        setCurrentDate(currentDate.add(1, 'week'));
        break;
      case 'month':
        setCurrentDate(currentDate.add(1, 'month'));
        break;
      default:
        break;
    }
  };

  const handleToggleView = (newView) => {
    setView(newView);
  };

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleView={handleToggleView}
        view={view}
      />
      {/* {view === 'day' && < DayView currentDate={currentDate} events={formattedEvents} />} */}
      {/* {view === 'week' && < WeekView events={formattedEvents} />} */}
      <MonthGrid currentDate={currentDate} daysArray={daysArray} events={formattedEvents} />
    </>
  );
};

export default Calendar;
