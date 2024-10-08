import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token !== 'undefined') {
      setIsAuthenticated(true);
    }
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (accessToken) => {
    Cookies.set('access_token', accessToken, { expires: 1 / 48 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('access_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
