import { useState, useEffect } from 'react';
import { getDevices } from '../api/devices';

const useFetchScreens = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true);
        const fetchedScreens = await getDevices();
        setScreens(fetchedScreens);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);



  return { screens, loading, error };
};

export default useFetchScreens;
