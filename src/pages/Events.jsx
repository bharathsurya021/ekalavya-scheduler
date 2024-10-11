import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import EventFilters from '../components/event/EventFilters';
import useFetchEvents from '../hooks/useFetchEvents';
import { useAuth } from '../components/AuthContext';
import Calendar from '../components/Calendar';
const Events = ({ screen }) => {
        const { token } = useAuth()
        const { events: eventsData } = useFetchEvents(token)
        const [filteredEvents, setFilteredEvents] = useState(eventsData);
        const [selectedCollection, setSelectedCollection] = useState('');
        const [selectedDevice, setSelectedDevice] = useState('');

        useEffect(() => {
                const filtered = eventsData?.filter(
                        (event) =>
                                (selectedCollection === '' || event.collection_id === selectedCollection) &&
                                (selectedDevice === '' || event.alloted_devices.includes(selectedDevice))
                );
                setFilteredEvents(filtered);
        }, [selectedCollection, selectedDevice, eventsData]);

        const handleCollectionChange = (e) => setSelectedCollection(e.target.value);
        const handleDeviceChange = (e) => setSelectedDevice(e.target.value);

        const uniqueCollections = Array.from(new Set(eventsData?.map((event) => event.collection_id)));
        const uniqueDevices = Array.from(new Set(eventsData?.flatMap((event) => event.alloted_devices)));

        return (
                <DashboardLayout title="Events" subtitle={`Events Schedule for ${screen?.name || 'All Screens'}`}>
                        <EventFilters
                                collections={uniqueCollections}
                                devices={uniqueDevices}
                                selectedCollection={selectedCollection}
                                selectedDevice={selectedDevice}
                                onCollectionChange={handleCollectionChange}
                                onDeviceChange={handleDeviceChange}
                        />
                        <Calendar events={eventsData} />
                </DashboardLayout>
        );
};

export default Events;
