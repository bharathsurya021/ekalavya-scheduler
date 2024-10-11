import { useState, useEffect } from 'react';
import { getEvents } from '../api/events';

const useFetchEvents = () => {
  const [Events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { Events, loading, error };
};

export default useFetchEvents;
