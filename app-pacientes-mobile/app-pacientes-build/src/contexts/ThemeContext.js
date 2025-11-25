import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState(systemColorScheme || 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@app_theme');
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error('Error al cargar tema:', error);
    }
  };

  const setTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('@app_theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = {
    light: {
      background: '#ffffff',
      text: '#000000',
      card: '#f3f4f6',
      border: '#e5e7eb',
      primary: '#1e40af',
    },
    dark: {
      background: '#1f2937',
      text: '#ffffff',
      card: '#374151',
      border: '#4b5563',
      primary: '#3b82f6',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export default ThemeContext;