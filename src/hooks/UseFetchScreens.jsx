import { useState, useEffect, useCallback } from 'react';
import { getDevices } from '../api/devices';

const UseFetchScreens = () => {
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    const fetchScreens = async () => {
      const fetchedScreens = await getDevices();
      setScreens(fetchedScreens);
    };

    fetchScreens();
  }, []);

  const addScreen = useCallback((newScreen) => {
    setScreens((prevScreens) => [...prevScreens, newScreen]);
  }, []);

  return { screens, addScreen };
};

export default UseFetchScreens;
