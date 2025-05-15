import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus } from '../../types';
import { Plus, MoreVertical, Calendar, PaperclipIcon, MessageSquare, Activity, ListFilter } from 'lucide-react';
import Button from '../ui/Button';
import ProjectActivities from './ProjectActivities';
import ProjectTasksList from './ProjectTasksList';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const { projects, updateTask, addTask, isDarkMode } = useApp();
  const [showAddTask, setShowAddTask] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [view, setView] = useState<'board' | 'activities' | 'list'>('board');
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return <div>Project not found</div>;
  }
  
  const columns: { title: string; status: TaskStatus; color: string }[] = [
    { title: 'To Do', status: 'todo', color: 'bg-gray-100 dark:bg-gray-700' },
    { title: 'In Progress', status: 'in-progress', color: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Review', status: 'review', color: 'bg-amber-100 dark:bg-amber-900' },
    { title: 'Completed', status: 'completed', color: 'bg-green-100 dark:bg-green-900' },
  ];
  
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return project.tasks.filter(task => task.status === status);
  };
  
  const handleAddTaskSubmit = (status: TaskStatus) => {
    if (newTaskTitle.trim() === '') return;
    
    addTask(projectId, {
      title: newTaskTitle,
      description: '',
      status,
      priority: 'medium',
    });
    
    setNewTaskTitle('');
    setShowAddTask(null);
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
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  const renderViewButton = (viewType: 'board' | 'activities' | 'list', icon: React.ReactNode, label: string) => (
    <Button
      variant={view === viewType ? 'primary' : 'outline'}
      size="sm"
      leftIcon={icon}
      onClick={() => setView(viewType)}
    >
      {label}
    </Button>
  );
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{project.description}</p>
        </div>
        <div className="flex gap-2">
          {renderViewButton('board', <Plus size={16} />, 'Board')}
          {renderViewButton('list', <ListFilter size={16} />, 'List')}
          {renderViewButton('activities', <Activity size={16} />, 'Activities')}
        </div>
      </div>
      
      {view === 'activities' && <ProjectActivities projectId={projectId} />}
      {view === 'list' && <ProjectTasksList projectId={projectId} />}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div 
              key={column.status} 
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm flex flex-col`}
            >
              <div className={`p-4 rounded-t-xl flex justify-between items-center ${column.color}`}>
                <h3 className="font-medium">{column.title}</h3>
                <span className="bg-white dark:bg-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                  {getTasksByStatus(column.status).length}
                </span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-240px)] space-y-3">
                {getTasksByStatus(column.status).map(task => (
                  <div 
                    key={task.id} 
                    className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} p-4 rounded-lg cursor-pointer transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {task.description.length > 60 
                          ? `${task.description.substring(0, 60)}...` 
                          : task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={12} className="mr-1" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <PaperclipIcon size={12} className="mr-1" />
                            <span>{task.attachments.length}</span>
                          </div>
                        )}
                        
                        {task.comments && task.comments.length > 0 && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <MessageSquare size={12} className="mr-1" />
                            <span>{task.comments.length}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {task.assignee && (
                          task.assignee.avatar ? (
                            <img 
                              src={task.assignee.avatar} 
                              alt={task.assignee.name} 
                              className="w-6 h-6 rounded-full object-cover"
                              title={task.assignee.name}
                            />
                          ) : (
                            <div 
                              className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"
                              title={task.assignee.name}
                            >
                              {task.assignee.name.charAt(0)}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {showAddTask === column.status ? (
                  <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <input
                      type="text"
                      placeholder="Enter task title..."
                      className={`w-full p-2 mb-2 border rounded ${isDarkMode ? 'bg-gray-600 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddTaskSubmit(column.status)}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddTask(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={`w-full p-2 mt-2 rounded-lg border border-dashed ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700'
                    } flex items-center justify-center text-sm`}
                    onClick={() => setShowAddTask(column.status)}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;