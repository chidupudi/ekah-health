import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { colors } from './styles/colors';

function App() {
  const mainContentStyle = {
    marginLeft: '280px',
    padding: '2rem',
    backgroundColor: colors.ghostWhite,
    minHeight: 'calc(100vh - 80px)',
    color: colors.lightSlateGray
  };
  

  return (
    <div style={{ backgroundColor: colors.ghostWhite, minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <main style={mainContentStyle}>
        <h1>Welcome to Ekah Health</h1>
        <p>Select a course or service from the sidebar to get started.</p>
      </main>
    </div>
  );
}

export default App;