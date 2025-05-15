import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, FolderKanban, Upload } from 'lucide-react';
import Button from '../ui/Button';
import AddProjectModal from './AddProjectModal';
import CSVImportModal from '../import/CSVImportModal';

const ProjectsList: React.FC = () => {
  const { projects, setCurrentProject, isDarkMode } = useApp();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and track all your projects in one place
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              leftIcon={<Upload size={16} />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              leftIcon={<FolderKanban size={16} />}
              onClick={() => setIsAddProjectModalOpen(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-sm overflow-hidden`}
            >
              <div
                className="h-2"
                style={{ backgroundColor: project.color }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    {project.category && (
                      <span className={`
                        inline-block px-2 py-1 text-xs rounded-full mt-2
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'}
                      `}>
                        {project.category}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentProject(project)}
                  >
                    View
                  </Button>
                </div>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      <span>{getTimeAgo(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Users size={16} className="mr-1" />
                      <span>{project.members.length}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="relative"
                        title={member.name}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs
                          ${isDarkMode 
                            ? 'bg-gray-700 text-gray-300 border-gray-800' 
                            : 'bg-gray-100 text-gray-600 border-white'
                          }
                          border-2
                        `}
                      >
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
};

export default ProjectsList;