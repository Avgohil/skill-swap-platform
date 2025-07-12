import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import AnimatedBackground from './components/3D/AnimatedBackground';
import ParticleFieldContainer from './components/3D/ParticleField';
import HomePage from './components/Home/HomePage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProfilePage from './components/Profile/ProfilePage';
import BrowseSkills from './components/Browse/BrowseSkills';
import SwapsPage from './components/Swaps/SwapsPage';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const { currentView } = state;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'profile':
        return <ProfilePage />;
      case 'browse':
        return <BrowseSkills />;
      case 'swaps':
        return <SwapsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <ParticleFieldContainer />
      <AnimatedBackground intensity="medium" />
      <Header />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;