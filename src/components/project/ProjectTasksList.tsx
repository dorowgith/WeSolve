import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface ProjectTasksListProps {
  projectId: string;
}

const ProjectTasksList: React.FC<ProjectTasksListProps> = ({ projectId }) => {
  const { projects, isDarkMode } = useApp();
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return <div>Project not found</div>;
  }
  
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Project Tasks</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Detailed view of all tasks and their current status
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Clock size={16} />}
          >
            Export Timeline
          </Button>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {project.tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description.length > 100 
                            ? `${task.description.substring(0, 100)}...` 
                            : task.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignee ? (
                      <div className="flex items-center">
                        {task.assignee.avatar ? (
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">
                            {task.assignee.name.charAt(0)}
                          </div>
                        )}
                        <span>{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(task.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1" />
                      <span className={task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-600 dark:text-red-400' : ''}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.timeSpent ? (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} className="mr-1" />
                        {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksList;