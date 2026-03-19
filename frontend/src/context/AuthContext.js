import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('student');
    if (token && saved) {
      setStudent(JSON.parse(saved));
      authAPI.getMe().then(res => {
        setStudent(res.data.student);
        localStorage.setItem('student', JSON.stringify(res.data.student));
      }).catch(() => logout()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('student', JSON.stringify(res.data.student));
    setStudent(res.data.student);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    setStudent(null);
  };

  const updateStudent = (data) => {
    const updated = { ...student, ...data };
    setStudent(updated);
    localStorage.setItem('student', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, logout, updateStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
