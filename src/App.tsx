import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardOverview from './components/dashboard/DashboardOverview';
import KanbanBoard from './components/project/KanbanBoard';
import ProjectsList from './components/project/ProjectsList';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Check for user's preferred color scheme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);
  
  return (
    <AppProvider>
      <div className={`${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen flex`}>
        {/* Sidebar - hidden on mobile */}
        <div className={`hidden lg:block`}>
          <Sidebar 
            isMobile={false} 
            toggleMobileMenu={toggleMobileMenu}
            onNavigate={setCurrentView}
          />
        </div>
        
        {/* Mobile sidebar - shown when menu is open */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
          <Sidebar 
            isMobile={true} 
            toggleMobileMenu={toggleMobileMenu}
            onNavigate={setCurrentView}
          />
          
          {/* Backdrop for mobile menu */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMobileMenu}
          ></div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleMobileMenu={toggleMobileMenu} />
          
          <div className="flex-1 overflow-y-auto">
            <AppContent currentView={currentView} />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

interface AppContentProps {
  currentView: string;
}

const AppContent: React.FC<AppContentProps> = ({ currentView }) => {
  const { currentProject } = useApp();
  
  if (currentProject) {
    return <KanbanBoard projectId={currentProject.id} />;
  }
  
  switch (currentView) {
    case 'projects':
      return <ProjectsList />;
    default:
      return <DashboardOverview />;
  }
};

export default App;