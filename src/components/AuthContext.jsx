import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get('access_token');
    if (storedToken && storedToken !== 'undefined') {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

  }, [token, isAuthenticated]);

  const login = (accessToken, expiryInSec) => {
    Cookies.set('access_token', accessToken, { expires: expiryInSec / 86400 });
    const expiryTime = new Date(new Date().getTime() + expiryInSec * 1000);
    Cookies.set('expiry_time', expiryTime.toISOString());
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('expiry_time');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
