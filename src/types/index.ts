export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  timeSpent?: number; // in minutes
  attachments?: Attachment[];
  comments?: Comment[];
  priority: 'low' | 'medium' | 'high';
};

export type Comment = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  tasks: Task[];
  members: User[];
  createdAt: string;
  updatedAt: string;
  category?: string;
};

export type DashboardStats = {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  tasksThisWeek: number;
  upcomingDeadlines: Task[];
  recentActivity: Activity[];
};

export type Activity = {
  id: string;
  description: string;
  user: User;
  timestamp: string;
  projectId: string;
  taskId?: string;
};