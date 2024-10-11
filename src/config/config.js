const BASE_URL = import.meta.env.VITE_APP_API_URL;
const APP_MODE = import.meta.env.VITE_APP_MODE;

const config = {
  baseURL: BASE_URL,
  authUrl: `${BASE_URL}/auth`,
  devicesUrl: `${BASE_URL}/devices`,
  collectionsUrl: `${BASE_URL}/collections`,
  eventsUrl: `${BASE_URL}/events`,
  appMode: APP_MODE,
};

export default config;
