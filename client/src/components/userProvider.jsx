import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // שמירת פרטי המשתמש ב-localStorage
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user'); // ניקוי פרטי המשתמש מה-localStorage
  };

  const getUser = () => {
    return user;
  };

  const logout = () => {
    clearUser();
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, saveUser, clearUser, logout, getUser }}>
      {children}
    </UserContext.Provider>
  );
};
