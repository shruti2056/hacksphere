import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hacksphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('hacksphere_user', JSON.stringify(res.data));
      setLoading(false);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/register', userData);
      setUser(res.data);
      localStorage.setItem('hacksphere_user', JSON.stringify(res.data));
      setLoading(false);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const quickSwitchUser = async (roleEmail) => {
    return login(roleEmail, 'password123');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hacksphere_user');
  };

  const updateUserProfile = async (updateData) => {
    try {
      const res = await API.put('/auth/profile', updateData);
      setUser(res.data);
      localStorage.setItem('hacksphere_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        quickSwitchUser,
        updateUserProfile,
        isAdmin: user?.role === 'Administrator',
        isOrganizer: user?.role === 'Organizer',
        isJudge: user?.role === 'Judge',
        isParticipant: user?.role === 'Participant',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
