import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Typography, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import PageContainer from '../components/containers/PageContainer';

const CalendarScheduler = () => {
        const location = useLocation();
        const { screen } = location.state || {};
        const [events, setEvents] = useState(screen?.events || []);
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [currentEvent, setCurrentEvent] = useState(null);
        const [eventDetails, setEventDetails] = useState({ title: '', start: '', end: '' });

        const handleDateClick = (info) => {
                // Find event for the clicked date
                const clickedEvent = events.find(event => event.start === info.dateStr);

                if (clickedEvent) {
                        // If an event exists for the clicked date, edit the event
                        setCurrentEvent(clickedEvent);
                        setEventDetails({ title: clickedEvent.title, start: clickedEvent.start, end: clickedEvent.end });
                        setIsDialogOpen(true);
                } else {
                        // If no event exists for the clicked date, add a new event
                        setEventDetails({ title: '', start: info.dateStr, end: info.dateStr });
                        setIsDialogOpen(true);
                }
        };

        const handleEventClick = (info) => {
                setCurrentEvent(info.event);
                setEventDetails({ title: info.event.title, start: info.event.startStr, end: info.event.endStr });
                setIsDialogOpen(true);
        };

        const handleEventAdd = () => {
                const newEvent = { id: events.length + 1, title: eventDetails.title, start: eventDetails.start, end: eventDetails.end };
                setEvents([...events, newEvent]);
                setIsDialogOpen(false);
        };

        const handleEventDelete = () => {
                setEvents(events.filter(event => event !== currentEvent));
                setIsDialogOpen(false);
        };

        const handleEventEdit = () => {
                currentEvent.title = eventDetails.title;
                currentEvent.start = eventDetails.start;
                currentEvent.end = eventDetails.end;
                setIsDialogOpen(false);
        };

        return (
                <PageContainer title="Calendar Scheduler" description={`Schedule for ${screen?.name}`}>
                        <Grid container spacing={3}>
                                <Grid item sm={12}>
                                        <Typography variant="h4">Calendar Scheduler for {screen?.name}</Typography>
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
                                                type="datetime-local"
                                                value={eventDetails.start}
                                                onChange={(e) => setEventDetails({ ...eventDetails, start: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                        <TextField
                                                label="End Date"
                                                type="datetime-local"
                                                value={eventDetails.end}
                                                onChange={(e) => setEventDetails({ ...eventDetails, end: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                        />
                                </DialogContent>
                                <DialogActions>
                                        {currentEvent && <Button onClick={handleEventDelete} color="secondary">Delete</Button>}
                                        <Button onClick={() => setIsDialogOpen(false)} color="primary">Cancel</Button>
                                        {!currentEvent && <Button onClick={handleEventAdd} color="primary">Add</Button>}
                                        {currentEvent && <Button onClick={handleEventEdit} color="primary">Save</Button>}
                                </DialogActions>
                        </Dialog>
                </PageContainer>
        );
};

export default CalendarScheduler;
