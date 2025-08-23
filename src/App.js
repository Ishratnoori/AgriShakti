import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import FarmerDashboard from './components/FarmerDashboard';
import './App.css';

function App() {
  const [farmerData, setFarmerData] = useState(null);

  const handleLogin = (data) => {
    setFarmerData(data);
  };

  const handleLogout = () => {
    setFarmerData(null);
  };

  return (
    <div className="App">
      {!farmerData ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
