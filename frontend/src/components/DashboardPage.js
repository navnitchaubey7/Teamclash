import React from 'react';
import TopNavbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  return (
    <div>
      <TopNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />

        {/* Main Content Area */}
        <div style={{ marginLeft: '220px', padding: '20px', width: '100%' }}>
          <h2>Main Dashboard Contenttttt</h2>
          <p>Yahan pe stats ya activity feed aayega...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
