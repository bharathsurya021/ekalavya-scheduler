import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Typography, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, FormControlLabel, Select, MenuItem, FormGroup, Checkbox } from '@mui/material';
import PageContainer from '../components/containers/PageContainer';
import { RRule } from 'rrule';
import { useLocation } from 'react-router-dom';

const CalendarScheduler = () => {
        const [events, setEvents] = useState([]);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [currentEvent, setCurrentEvent] = useState(null);
        const [eventDetails, setEventDetails] = useState({
                title: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                recurring: false,
                frequency: '',
                daysOfWeek: []
        });

        const location = useLocation()
        const handleDateClick = (info) => {
                setEventDetails({
                        title: '',
                        startDate: info.dateStr,
                        endDate: info.dateStr,
                        startTime: '',
                        endTime: '',
                        recurring: false,
                        frequency: '',
                        daysOfWeek: []
                });
                setIsDialogOpen(true);
        };
        useEffect(() => {
                if (location.state && location.state.screen) {
                        const selectedScreen = location.state.screen;
                        // Assuming selectedScreen contains events in the format you need
                        setEvents(selectedScreen.events);
                }
        }, [location.state]);
        const handleEventClick = (info) => {
                setCurrentEvent(info.event);
                setEventDetails({
                        title: info.event.title,
                        startDate: info.event.startStr.split('T')[0],
                        endDate: info.event.endStr.split('T')[0],
                        startTime: info.event.startStr.split('T')[1].slice(0, 5), // Adjusted to only take time part HH:MM
                        endTime: info.event.endStr.split('T')[1].slice(0, 5), // Adjusted to only take time part HH:MM
                        recurring: !!info.event.extendedProps.rrule,
                        frequency: info.event.extendedProps.rrule ? info.event.extendedProps.rrule.freq : '',
                        daysOfWeek: info.event.extendedProps.rrule ? info.event.extendedProps.rrule.byweekday : []
                });
                setIsDialogOpen(true);
        };

        const handleEventAdd = () => {
                const { startDate, endDate, startTime, endTime, recurring } = eventDetails;
                let newEvents = [];

                if (recurring) {
                        const rule = generateRRule();
                        const occurrences = rule.all();

                        occurrences.forEach((date) => {
                                const eventId = `${eventDetails.title}-${date.toISOString().split('T')[0]}-${startTime}-${endTime}`; // Unique ID based on title, date, and times
                                newEvents.push({
                                        id: eventId,
                                        title: eventDetails.title,
                                        start: new Date(`${date.toISOString().split('T')[0]}T${startTime}:00`).toISOString(), // Adjusted to format HH:MM:00 for time part
                                        end: new Date(`${date.toISOString().split('T')[0]}T${endTime}:00`).toISOString(), // Adjusted to format HH:MM:00 for time part
                                        rrule: rule.toString()
                                });
                        });
                } else {
                        const eventId = `${eventDetails.title}-${startDate}-${startTime}-${endTime}`; // Unique ID based on title, date, and times
                        newEvents.push({
                                id: eventId,
                                title: eventDetails.title,
                                start: `${startDate}T${startTime}:00`, // Adjusted to format HH:MM:00 for time part
                                end: `${endDate}T${endTime}:00`, // Adjusted to format HH:MM:00 for time part
                                rrule: null
                        });
                }

                setEvents([...events, ...newEvents]);
                setIsDialogOpen(false);
        };

        const handleEventEdit = (editSeries) => {
                const { startDate, endDate, startTime, endTime, recurring } = eventDetails;

                if (editSeries && currentEvent.extendedProps.rrule) {
                        setEvents(events.filter(event => !event.rrule || event.rrule !== currentEvent.extendedProps.rrule));

                        const rule = generateRRule();
                        const occurrences = rule.all();

                        occurrences.forEach((date) => {
                                const eventId = `${eventDetails.title}-${date.toISOString().split('T')[0]}-${startTime}-${endTime}`; // Unique ID based on title, date, and times
                                setEvents(prevEvents => [
                                        ...prevEvents,
                                        {
                                                id: eventId,
                                                title: eventDetails.title,
                                                start: new Date(`${date.toISOString().split('T')[0]}T${startTime}:00`).toISOString(), // Adjusted to format HH:MM:00 for time part
                                                end: new Date(`${date.toISOString().split('T')[0]}T${endTime}:00`).toISOString(), // Adjusted to format HH:MM:00 for time part
                                                rrule: rule.toString()
                                        }
                                ]);
                        });
                } else {
                        const eventId = `${eventDetails.title}-${startDate}-${startTime}-${endTime}`; // Unique ID based on title, date, and times
                        currentEvent.setProp('id', eventId); // Update the event ID
                        currentEvent.setProp('title', eventDetails.title);
                        currentEvent.setStart(`${startDate}T${startTime}:00`); // Adjusted to format HH:MM:00 for time part
                        currentEvent.setEnd(`${endDate}T${endTime}:00`); // Adjusted to format HH:MM:00 for time part
                        currentEvent.setExtendedProp('rrule', recurring ? generateRRule().toString() : null);
                }

                setIsDialogOpen(false);
        };

        const handleEventDelete = (deleteSeries) => {
                if (deleteSeries && currentEvent.extendedProps.rrule) {
                        setEvents(events.filter(event => !event.rrule || event.rrule !== currentEvent.extendedProps.rrule));
                } else {
                        setEvents(events.filter(event => event.id !== currentEvent.id));
                }
                setIsDialogOpen(false);
        };

        const generateRRule = () => {
                const { frequency, daysOfWeek, startDate, endDate } = eventDetails;
                let rruleOptions = {
                        freq: RRule[frequency?.toUpperCase()],
                        dtstart: new Date(startDate),
                        until: new Date(endDate)
                };

                if (frequency && frequency === 'weekly' && daysOfWeek?.length > 0) {
                        rruleOptions.byweekday = daysOfWeek.map(day => RRule[day.toUpperCase()]);
                }

                if (frequency && frequency === 'monthly') {
                        rruleOptions.bymonthday = new Date(startDate).getDate();
                }
                return new RRule(rruleOptions);
        };

        const handleDayOfWeekChange = (e, day) => {
                const { checked } = e.target;
                let updatedDaysOfWeek = [...eventDetails.daysOfWeek];

                if (checked && !updatedDaysOfWeek?.includes(day)) {
                        updatedDaysOfWeek.push(day);
                } else {
                        updatedDaysOfWeek = updatedDaysOfWeek.filter(d => d !== day);
                }

                setEventDetails({ ...eventDetails, daysOfWeek: updatedDaysOfWeek });
        };

        return (
                <PageContainer title="Calendar Scheduler" description="Schedule events with recurrence">
                        <Grid container spacing={3}>
                                <Grid item xs={12}>
                                        <Typography variant="h4">Calendar Scheduler</Typography>
                                        <FullCalendar
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                initialView="dayGridMonth"
                                                events={events}
                                                dateClick={handleDateClick}
                                                eventClick={handleEventClick}
                                                editable
                                                headerToolbar={{
                                                        left: 'prev,next today',
                                                        center: 'title',
                                                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                                }}
                                        />
                                </Grid>
                        </Grid>
                        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                                <DialogTitle>{currentEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
                                <DialogContent>
                                        <TextField
                                                label="Title"
                                                value={eventDetails.title}
                                                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <TextField
                                                label="Start Date"
                                                type="date"
                                                value={eventDetails.startDate}
                                                onChange={(e) => setEventDetails({ ...eventDetails, startDate: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <TextField
                                                label="End Date"
                                                type="date"
                                                value={eventDetails.endDate}
                                                onChange={(e) => setEventDetails({ ...eventDetails, endDate: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <TextField
                                                label="Start Time"
                                                type="time"
                                                value={eventDetails.startTime}
                                                onChange={(e) => setEventDetails({ ...eventDetails, startTime: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <TextField
                                                label="End Time"
                                                type="time"
                                                value={eventDetails.endTime}
                                                onChange={(e) => setEventDetails({ ...eventDetails, endTime: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <FormControl component="fieldset" margin="normal">
                                                <FormControlLabel
                                                        control={<Checkbox checked={eventDetails.recurring} onChange={(e) => setEventDetails({ ...eventDetails, recurring: e.target.checked })} />}
                                                        label="Recurring Event"
                                                />
                                                {eventDetails.recurring && (
                                                        <div>
                                                                <Select
                                                                        value={eventDetails.frequency}
                                                                        onChange={(e) => setEventDetails({ ...eventDetails, frequency: e.target.value })}
                                                                        fullWidth
                                                                        margin="normal"
                                                                >
                                                                        <MenuItem value="daily">Daily</MenuItem>
                                                                        <MenuItem value="weekly">Weekly</MenuItem>
                                                                        <MenuItem value="monthly">Monthly</MenuItem>
                                                                        <MenuItem value="yearly">Yearly</MenuItem>
                                                                </Select>
                                                                {eventDetails.frequency === 'weekly' && (
                                                                        <FormGroup>
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('mo')} onChange={(e) => handleDayOfWeekChange(e, 'mo')} />}
                                                                                        label="Monday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('tu')} onChange={(e) => handleDayOfWeekChange(e, 'tu')} />}
                                                                                        label="Tuesday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('we')} onChange={(e) => handleDayOfWeekChange(e, 'we')} />}
                                                                                        label="Wednesday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('th')} onChange={(e) => handleDayOfWeekChange(e, 'th')} />}
                                                                                        label="Thursday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('fr')} onChange={(e) => handleDayOfWeekChange(e, 'fr')} />}
                                                                                        label="Friday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('sa')} onChange={(e) => handleDayOfWeekChange(e, 'sa')} />}
                                                                                        label="Saturday"
                                                                                />
                                                                                <FormControlLabel
                                                                                        control={<Checkbox checked={eventDetails.daysOfWeek?.includes('su')} onChange={(e) => handleDayOfWeekChange(e, 'su')} />}
                                                                                        label="Sunday"
                                                                                />
                                                                        </FormGroup>
                                                                )}
                                                        </div>
                                                )}
                                        </FormControl>
                                </DialogContent>
                                <DialogActions>
                                        {currentEvent && (
                                                <div>
                                                        <Button onClick={() => handleEventDelete(false)} color="secondary">Delete This Event</Button>
                                                        <Button onClick={() => handleEventDelete(true)} color="secondary">Delete Entire Series</Button>
                                                </div>
                                        )}
                                        <Button onClick={() => setIsDialogOpen(false)} color="primary">Cancel</Button>
                                        {!currentEvent && <Button onClick={handleEventAdd} color="primary">Add</Button>}
                                        {currentEvent && (
                                                <div>
                                                        <Button onClick={() => handleEventEdit(false)} color="primary">Save This Event</Button>
                                                        <Button onClick={() => handleEventEdit(true)} color="primary">Save Entire Series</Button>
                                                </div>
                                        )}
                                </DialogActions>
                        </Dialog>
                </PageContainer>
        );
};

export default CalendarScheduler;
