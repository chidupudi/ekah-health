import React, { useState } from 'react';
import BookingsTable from '../../components/admin/BookingsTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsTable />;
      case 'calendar':
        return <div className="tab-content">📅 Calendar Management (Coming Soon)</div>;
      case 'patients':
        return <div className="tab-content">👥 Patient Management (Coming Soon)</div>;
      case 'settings':
        return <div className="tab-content">⚙️ Settings (Coming Soon)</div>;
      default:
        return <BookingsTable />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏥 EkahHealth Admin Dashboard</h1>
        <div className="admin-info">
          <span>Welcome, Admin</span>
          <button className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      <div className="admin-navigation">
        <button 
          className={activeTab === 'bookings' ? 'nav-active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button 
          className={activeTab === 'calendar' ? 'nav-active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          📆 Calendar
        </button>
        <button 
          className={activeTab === 'patients' ? 'nav-active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          👥 Patients
        </button>
        <button 
          className={activeTab === 'settings' ? 'nav-active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;