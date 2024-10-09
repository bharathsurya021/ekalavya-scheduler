import axios from 'axios';

const API_BASE_URL = 'http://13.234.225.151:8000/api/v1/collections';

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

export const createEvents = async (collection) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, collection, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error upserting collection:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addFilesToEvents = async (collectionName, files) => {
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
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteEvent = async (collectionName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${collectionName}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting collection:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteFileFromEvent = async (collectionName, fileName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${collectionName}/file/${fileName}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting file:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const downloadFile = async (collectionName, fileName) => {
  try {
    const response = await apiClient.get(`/${collectionName}/file/${fileName}`, {
      withCredentials: true,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error.response ? error.response.data : error.message);
    throw error;
  }
};
