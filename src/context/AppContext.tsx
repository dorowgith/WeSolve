import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, User, Activity, DashboardStats } from '../types';
import { generateMockData } from '../utils/mockData';

type AppContextType = {
  currentUser: User;
  projects: Project[];
  activities: Activity[];
  stats: DashboardStats;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'members'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'comments' | 'attachments'>) => Promise<Task>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mockData, setMockData] = useState(() => generateMockData());
  const [currentUser, setCurrentUser] = useState<User>(mockData.currentUser);
  const [projects, setProjects] = useState<Project[]>(mockData.projects);
  const [activities, setActivities] = useState<Activity[]>(mockData.activities);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculate dashboard stats
  const calculateStats = (): DashboardStats => {
    const totalProjects = projects.length;
    const allTasks = projects.flatMap(p => p.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    
    // Get tasks due this week
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const tasksThisWeek = allTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;
    
    // Get upcoming deadlines (next 3 days)
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    
    const upcomingDeadlines = allTasks
      .filter(task => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= threeDaysLater;
      })
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
    
    // Recent activity - just take the 10 most recent
    const recentActivity = [...activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    return {
      totalProjects,
      totalTasks,
      completedTasks,
      tasksThisWeek,
      upcomingDeadlines,
      recentActivity
    };
  };

  const [stats, setStats] = useState<DashboardStats>(() => calculateStats());

  // Update stats whenever relevant data changes
  useEffect(() => {
    setStats(calculateStats());
  }, [projects, activities]);

  // Add a new project
  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks' | 'members'>): Promise<Project> => {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      tasks: [],
      members: [currentUser],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    
    // Add activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: `Project "${newProject.name}" was created`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      projectId: newProject.id,
    };
    
    setActivities(prev => [newActivity, ...prev]);
    
    return newProject;
  };

  // Update a project
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() } 
          : project
      )
    );
    
    // Add activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: `Project was updated`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      projectId,
    };
    
    setActivities(prev => [newActivity, ...prev]);
  };

  // Delete a project
  const deleteProject = (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;
    
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    // Add activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: `Project "${projectToDelete.name}" was deleted`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      projectId: 'deleted',
    };
    
    setActivities(prev => [newActivity, ...prev]);
    
    // If the deleted project was the current project, set currentProject to null
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  // Add a task to a project
  const addTask = async (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'comments' | 'attachments'>): Promise<Task> => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId,
      comments: [],
      attachments: [],
    };
    
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: [...project.tasks, newTask],
              updatedAt: new Date().toISOString()
            } 
          : project
      )
    );
    
    // Add activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: `Task "${newTask.title}" was created`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      projectId,
      taskId: newTask.id,
    };
    
    setActivities(prev => [newActivity, ...prev]);
    
    return newTask;
  };

  // Update a task
  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: project.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
                  : task
              ),
              updatedAt: new Date().toISOString()
            } 
          : project
      )
    );
    
    // Add activity
    const task = projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId);
    
    if (task) {
      // Create a description based on what was updated
      let description = `Task "${task.title}" was updated`;
      
      if (updates.status && updates.status !== task.status) {
        description = `Task "${task.title}" status changed to ${updates.status}`;
      } else if (updates.assignee && (!task.assignee || task.assignee.id !== updates.assignee.id)) {
        description = `Task "${task.title}" was assigned to ${updates.assignee.name}`;
      }
      
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        description,
        user: currentUser,
        timestamp: new Date().toISOString(),
        projectId,
        taskId,
      };
      
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  // Delete a task
  const deleteTask = (projectId: string, taskId: string) => {
    const task = projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              tasks: project.tasks.filter(task => task.id !== taskId),
              updatedAt: new Date().toISOString()
            } 
          : project
      )
    );
    
    // Add activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      description: `Task "${task.title}" was deleted`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      projectId,
    };
    
    setActivities(prev => [newActivity, ...prev]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        projects,
        activities,
        stats,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};