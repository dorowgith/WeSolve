import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, CheckCircle, Clock, ListTodo, ArrowUpRight } from 'lucide-react';
import Button from '../ui/Button';

const DashboardOverview: React.FC = () => {
  const { stats, isDarkMode } = useApp();
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get time-relative string (e.g., "2 hours ago")
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening with your projects today.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 rounded-xl shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalProjects}</h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ListTodo size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
            <ArrowUpRight size={16} className="mr-1" />
            <span>Active</span>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 rounded-xl shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks This Week</p>
              <h3 className="text-2xl font-bold mt-1">{stats.tasksThisWeek}</h3>
            </div>
            <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
              <Calendar size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Due this week</span>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 rounded-xl shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{stats.completedTasks}</h3>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
            <ArrowUpRight size={16} className="mr-1" />
            <span>{Math.round((stats.completedTasks / stats.totalTasks) * 100)}% completion rate</span>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-5 rounded-xl shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalTasks}</h3>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <Clock size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Across all projects</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming deadlines */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm col-span-1 lg:col-span-2`}>
          <div className="p-5 border-b dark:border-gray-700">
            <h2 className="font-bold">Upcoming Deadlines</h2>
          </div>
          <div className="p-5">
            {stats.upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingDeadlines.map((task) => (
                  <div key={task.id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description.length > 60 
                            ? `${task.description.substring(0, 60)}...` 
                            : task.description}
                        </p>
                      </div>
                      {task.dueDate && (
                        <div className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${new Date(task.dueDate).getTime() < new Date().getTime() 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}
                        `}>
                          Due {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        {task.assignee && (
                          <div className="flex items-center">
                            {task.assignee.avatar ? (
                              <img 
                                src={task.assignee.avatar} 
                                alt={task.assignee.name} 
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">
                                {task.assignee.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {task.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${task.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
                      `}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </div>
          </div>
        </div>
        
        {/* Recent activity */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
          <div className="p-5 border-b dark:border-gray-700">
            <h2 className="font-bold">Recent Activity</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
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
                  
                  <div>
                    <p className="text-sm">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;