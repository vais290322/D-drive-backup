import React, { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token) {
      setLoggedIn(true);
      if (userData) setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (data) => {
    setLoggedIn(true);
    if (data && data.data) {
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
    }
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return loggedIn ? (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar />
      <div className="ml-64">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="px-4">
          <AppRoutes isAuthenticated={loggedIn} onLogin={handleLogin} user={user} onLogout={handleLogout} />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <AppRoutes isAuthenticated={loggedIn} onLogin={handleLogin} user={user} onLogout={handleLogout} />
  );
}

export default App;