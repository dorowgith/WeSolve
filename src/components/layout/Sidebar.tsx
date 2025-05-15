import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layout, Home, FolderKanban, Calendar, Clock, Users, Settings, ChevronLeft, ChevronRight, PlusCircle, Menu } from 'lucide-react';
import Button from '../ui/Button';
import AddProjectModal from '../project/AddProjectModal';

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  count?: number;
};

interface SidebarProps {
  isMobile: boolean;
  toggleMobileMenu: () => void;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, toggleMobileMenu, onNavigate }) => {
  const { projects, currentProject, setCurrentProject, isDarkMode } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(true);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const mainItems: SidebarItem[] = [
    { icon: <Home size={20} />, label: 'Dashboard', path: 'dashboard' },
    { icon: <FolderKanban size={20} />, label: 'Projects', path: 'projects', count: projects.length },
    { icon: <Calendar size={20} />, label: 'Calendar', path: 'calendar' },
    { icon: <Clock size={20} />, label: 'Time Tracking', path: 'time' },
    { icon: <Users size={20} />, label: 'Team', path: 'team' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (path: string) => {
    onNavigate(path);
    if (path === 'dashboard') {
      setCurrentProject(null);
    }
    if (isMobile) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      <aside 
        className={`
          ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} 
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 shadow-lg transform transition-transform duration-300 ease-in-out' : 'relative'}
          h-screen flex-shrink-0 border-r transition-all duration-300 ease-in-out
        `}
      >
        {/* Top section with logo and toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!isCollapsed ? (
            <div className="flex items-center">
              <Layout className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-bold text-lg">Dorowcamp</span>
            </div>
          ) : (
            <Layout className="h-6 w-6 mx-auto text-blue-600" />
          )}
          
          {isMobile ? (
            <button 
              onClick={toggleMobileMenu} 
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu size={20} />
            </button>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <nav className="px-2 py-4">
            <ul className="space-y-1">
              {mainItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm rounded-md 
                      ${
                        item.path === currentProject ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-between'}
                    `}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                    
                    {!isCollapsed && item.count !== undefined && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {item.count}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Projects section */}
            <div className="mt-8">
              <div 
                className={`
                  ${!isCollapsed ? 'flex items-center justify-between px-3 mb-2' : 'text-center mb-2'} 
                  text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400
                `}
                onClick={() => !isCollapsed && setShowProjectsDropdown(!showProjectsDropdown)}
              >
                {!isCollapsed ? (
                  <>
                    <span>Projects</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<PlusCircle size={16} />}
                      className="!p-1"
                      onClick={() => setIsAddProjectModalOpen(true)}
                    >
                      New
                    </Button>
                  </>
                ) : (
                  <span className="text-[10px]">Projects</span>
                )}
              </div>

              {showProjectsDropdown && (
                <ul className="space-y-1">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <button
                        onClick={() => {
                          setCurrentProject(project);
                          if (isMobile) toggleMobileMenu();
                        }}
                        className={`
                          w-full text-left flex items-center px-3 py-2 text-sm rounded-md 
                          ${
                            currentProject?.id === project.id 
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                          style={{ backgroundColor: project.color }}
                        />
                        {!isCollapsed && (
                          <span className="truncate">
                            {project.name}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>
        </div>

        {/* Settings at bottom */}
        <div className={`absolute bottom-0 w-full p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => handleNavigation('settings')}
            className={`
              w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <Settings size={20} />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </button>
        </div>
      </aside>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;