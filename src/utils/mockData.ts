import { User, Project, Task, Activity } from '../types';

export const generateMockData = () => {
  // Mock users
  const users: User[] = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'user-3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'user-4',
      name: 'Alice Williams',
      email: 'alice@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];
  
  const currentUser = users[0];
  
  // Generate tasks for each project
  const createTasks = (projectId: string, count: number): Task[] => {
    const statuses: Task['status'][] = ['todo', 'in-progress', 'review', 'completed'];
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    
    return Array.from({ length: count }).map((_, index) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const now = new Date();
      const dueDate = new Date();
      dueDate.setDate(now.getDate() + Math.floor(Math.random() * 14)); // Random due date within next 2 weeks
      
      const task: Task = {
        id: `task-${projectId}-${index + 1}`,
        title: `Task ${index + 1} for Project ${projectId.split('-')[1]}`,
        description: `This is a detailed description for task ${index + 1}. It contains all the necessary information to complete this task.`,
        status,
        dueDate: dueDate.toISOString(),
        assignee: users[Math.floor(Math.random() * users.length)],
        createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random creation date within past week
        updatedAt: now.toISOString(),
        projectId,
        timeSpent: status === 'completed' ? Math.floor(Math.random() * 120) : undefined, // Random time spent for completed tasks
        comments: [],
        attachments: [],
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
      
      return task;
    });
  };
  
  // Mock projects
  const projects: Project[] = [
    {
      id: 'project-1',
      name: 'Website Redesign',
      description: 'Modernize the company website with a fresh look and improved functionality.',
      color: '#3B82F6', // blue
      tasks: createTasks('project-1', 8),
      members: [users[0], users[1], users[2]],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: new Date().toISOString(),
      category: 'Marketing'
    },
    {
      id: 'project-2',
      name: 'Mobile App Development',
      description: 'Create a cross-platform mobile application for our customers.',
      color: '#14B8A6', // teal
      tasks: createTasks('project-2', 12),
      members: [users[0], users[3]],
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      category: 'Development'
    },
    {
      id: 'project-3',
      name: 'Q3 Marketing Campaign',
      description: 'Plan and execute the marketing strategy for Q3.',
      color: '#F59E0B', // amber
      tasks: createTasks('project-3', 6),
      members: [users[0], users[1]],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      category: 'Marketing'
    },
    {
      id: 'project-4',
      name: 'Product Launch',
      description: 'Coordinate all aspects of the new product launch.',
      color: '#EC4899', // pink
      tasks: createTasks('project-4', 10),
      members: users,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      category: 'Product'
    }
  ];
  
  // Generate mock activity
  const activities: Activity[] = [];
  
  // Create some mock activities
  const activityDescriptions = [
    'created the project',
    'updated the project description',
    'added a new task',
    'completed task',
    'assigned task to',
    'updated task status to in-progress',
    'commented on task',
    'attached a file to task',
    'updated project settings',
    'added a new team member'
  ];
  
  // Generate 20 random activities
  for (let i = 0; i < 20; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const activityType = activityDescriptions[Math.floor(Math.random() * activityDescriptions.length)];
    
    let description = '';
    let taskId: string | undefined;
    
    if (activityType.includes('task')) {
      if (project.tasks.length > 0) {
        const task = project.tasks[Math.floor(Math.random() * project.tasks.length)];
        taskId = task.id;
        
        if (activityType === 'added a new task') {
          description = `${user.name} added a new task "${task.title}"`;
        } else if (activityType === 'completed task') {
          description = `${user.name} marked task "${task.title}" as completed`;
        } else if (activityType === 'assigned task to') {
          const assignee = users[Math.floor(Math.random() * users.length)];
          description = `${user.name} assigned task "${task.title}" to ${assignee.name}`;
        } else if (activityType === 'updated task status to in-progress') {
          description = `${user.name} updated task "${task.title}" status to in-progress`;
        } else if (activityType === 'commented on task') {
          description = `${user.name} commented on task "${task.title}"`;
        } else if (activityType === 'attached a file to task') {
          description = `${user.name} attached a file to task "${task.title}"`;
        }
      } else {
        description = `${user.name} ${activityType} in project "${project.name}"`;
      }
    } else {
      description = `${user.name} ${activityType} "${project.name}"`;
    }
    
    // Generate a random timestamp within the last 7 days
    const now = new Date();
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    
    activities.push({
      id: `activity-${i + 1}`,
      description,
      user,
      timestamp,
      projectId: project.id,
      taskId
    });
  }
  
  // Sort activities by timestamp (newest first)
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return {
    currentUser,
    users,
    projects,
    activities
  };
};