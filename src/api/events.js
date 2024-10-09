import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/collections';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`, {
      withCredentials: true,
    });
    return response.data.collections;
  } catch (error) {
    console.error('Error fetching collections:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createEvents = async (collection, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, collection, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error upserting collection:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addFilesToEvents = async (collectionName, files, token) => {
  const formData = new FormData();
  formData.append('collection_name', collectionName);
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteEvent = async (collectionName, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${collectionName}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting collection:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteFileFromEvent = async (collectionName, fileName, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${collectionName}/file/${fileName}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const downloadFile = async (collectionName, fileName, token) => {
  try {
    const response = await apiClient.get(`/${collectionName}/file/${fileName}`, {
      withCredentials: true,
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error.response ? error.response.data : error.message);
    throw error;
  }
};
