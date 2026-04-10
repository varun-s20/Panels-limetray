export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  columnId: string;
  previousColumnId?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: number;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface AppState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  theme: 'light' | 'dark';
  filter: 'all' | 'pending' | 'completed';
}

export interface ToastConfig {
  id: string;
  message: string;
  subMessage?: string;
  taskSnapshot?: Task;
  visible: boolean;
}
