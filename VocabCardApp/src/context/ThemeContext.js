import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const { darkMode } = JSON.parse(settings);
        setIsDarkMode(darkMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newStatus = !isDarkMode;
      setIsDarkMode(newStatus);
      
      const settings = {
        darkMode: newStatus,
      };
      
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode ? {
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      border: '#333333',
      primary: '#007AFF',
      secondary: '#666666',
    } : {
      background: '#FFFFFF',
      card: '#F8F8F8',
      text: '#000000',
      border: '#DDDDDD',
      primary: '#007AFF',
      secondary: '#666666',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 