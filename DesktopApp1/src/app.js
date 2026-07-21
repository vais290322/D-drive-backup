import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Employees from './components/Employees/Employees';
import Calls from './components/Calls/Calls';
import Weather from './components/Weather/Weather';
import News from './components/News/News';
import Settings from './components/Settings/Settings';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Employees':
        return <Employees />;
      case 'Calls':
        return <Calls />;
      case 'Weather':
        return <Weather />;
      case 'News':
        return <News />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />
      <main className="content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;