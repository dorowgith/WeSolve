import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from 'lucide-react';

interface ProjectActivitiesProps {
  projectId: string;
}

const ProjectActivities: React.FC<ProjectActivitiesProps> = ({ projectId }) => {
  const { activities, isDarkMode } = useApp();

  const projectActivities = activities.filter(
    activity => activity.projectId === projectId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Project Activities</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track all activities and changes in this project
        </p>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
        {projectActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No activities found for this project
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projectActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-3">
                  {activity.user.avatar ? (
                    <img 
                      src={activity.user.avatar} 
                      alt={activity.user.name} 
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                      {activity.user.name.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.user.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectActivities;