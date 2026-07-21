import React, { useContext } from "react";
import { ThemeContext } from "./components/ThemeProvider"; // Adjust path based on your folder structureThemeProvider"; // Adjust path based on your folder structure

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className={`p-4 `}
    >
      <h1 className="text-red-900">
        Navbar - {theme === "light" ? "Light Mode" : "Dark Mode"}
      </h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </nav>
  );
};

export default Navbar;
