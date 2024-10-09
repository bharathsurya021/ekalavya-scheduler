import axios from 'axios';

const API_BASE_URL = 'http://13.234.225.151:8000/api/v1/devices';

export const createDevice = async (deviceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, deviceData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Error creating device:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getDeviceById = async (deviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${deviceId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching device:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getDevices = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching devices:', error.response ? error.response.data : error.message);
    throw error;
  }
};
