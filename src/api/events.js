import axios from 'axios';
import config from '../config/config';
const API_BASE_URL = config.eventsUrl

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      withCredentials: true,
    });
    return response.data.events;
  } catch (error) {
    console.error('Error fetching collections:', error.response ? error.response.data : error.message);
    throw error;
  }
};
