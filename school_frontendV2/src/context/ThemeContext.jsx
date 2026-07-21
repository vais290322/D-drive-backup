// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const ThemeContext = createContext();

// Provide the context
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default is 'light'

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
