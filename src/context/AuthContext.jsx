import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Register a new user
  const register = (userData) => {
    // Check if user already exists (Simple simulation)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(u => u.email === userData.email);

    if (userExists) {
      return { success: false, message: 'User already exists!' };
    }

    // Save new user
    existingUsers.push(userData);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    return { success: true, message: 'Registration successful! Please login.' };
  };

  // Login user
  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const validUser = existingUsers.find(u => u.email === email && u.password === password);

    if (validUser) {
      localStorage.setItem('currentUser', JSON.stringify(validUser));
      setUser(validUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  // Update Profile
  const updateProfile = (updatedData) => {
    // Update current session
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update database (users array)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newUsersList = existingUsers.map(u => u.email === user.email ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(newUsersList));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);