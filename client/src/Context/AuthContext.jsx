import React, {createContext, useContext, useState, useEffect} from 'react';
import { refreshAccessToken } from '../utils/refreshAccessToken';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
      const tryRefresh = async () => {
        const token = await refreshAccessToken();
        if(token) {
          setAccessToken(token);
        }
      }
      tryRefresh();
    }, []);

    const logout = async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setAccessToken(null);
    }
  };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);