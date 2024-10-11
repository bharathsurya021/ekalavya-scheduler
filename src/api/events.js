import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/events';

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
