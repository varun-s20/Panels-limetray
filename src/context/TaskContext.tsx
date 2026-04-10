import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Column, AppState, ToastConfig } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
  state: AppState;
  addTask: (columnId: string, title: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  deleteTaskWithUndo: (id: string) => void;
  moveTask: (taskId: string, sourceColId: string, destColId: string, newOrder: number) => void;
  reorderTask: (colId: string, startIndex: number, endIndex: number) => void;
  toggleComplete: (id: string) => void;
  addColumn: (title: string) => void;
  deleteColumn: (id: string) => void;
  setFilter: (filter: AppState['filter']) => void;
  toggleTheme: () => void;
  activeTaskDetail: string | null;
  setActiveTaskDetail: (id: string | null) => void;
  activeColumnId: string | null;
  setActiveColumnId: (id: string | null) => void;
  toastConfig: ToastConfig | null;
  hideToast: () => void;
  undoDelete: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialColumns: Record<string, Column> = {
  'col-1': { id: 'col-1', title: 'To Do', order: 0 },
  'col-2': { id: 'col-2', title: 'In Progress', order: 1 },
  'col-3': { id: 'col-3', title: 'Done', order: 2 },
};
const initialColumnOrder = ['col-1', 'col-2', 'col-3'];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Record<string, Task>>('taska-tasks', {});
  const [columns, setColumns] = useLocalStorage<Record<string, Column>>('taska-columns', initialColumns);
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>('taska-column-order', initialColumnOrder);
  const [theme, setTheme] = useLocalStorage<AppState['theme']>('taska-theme', 'light');
  const [filter, setFilter] = useLocalStorage<AppState['filter']>('taska-filter', 'all');
  
  const [activeTaskDetail, setActiveTaskDetail] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const addTask = useCallback((columnId: string, title: string) => {
    const newTaskId = uuidv4();
    const tasksInCol = Object.values(tasks).filter(t => t.columnId === columnId);
    const col = columns[columnId];
    const isDone = col ? (col.title.toLowerCase().includes('done') || col.title.toLowerCase().includes('completed')) : false;
    
    const newTask: Task = {
      id: newTaskId,
      title: title.trim(),
      completed: isDone,
      columnId,
      priority: 'medium',
      tags: [],
      createdAt: Date.now(),
      order: tasksInCol.length,
    };

    setTasks(prev => ({ ...prev, [newTaskId]: newTask }));
  }, [tasks, columns, setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ...updates }
      };
    });
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[id];
      return newTasks;
    });
  }, [setTasks]);

  const deleteTaskWithUndo = useCallback((id: string) => {
    const taskToDelete = tasks[id];
    if (!taskToDelete) return;

    if (activeTaskDetail === id) setActiveTaskDetail(null);

    setToastConfig({
      id: uuidv4(),
      message: 'Task deleted',
      subMessage: `"${taskToDelete.title}" was removed`,
      taskSnapshot: taskToDelete,
      visible: true
    });

    deleteTask(id);
  }, [tasks, deleteTask, activeTaskDetail]);

  const undoDelete = useCallback(() => {
    if (toastConfig && toastConfig.taskSnapshot) {
      const restoredTask = toastConfig.taskSnapshot;
      setTasks(prev => ({ ...prev, [restoredTask.id]: restoredTask }));
      setToastConfig(prev => prev ? { ...prev, visible: false } : null);
    }
  }, [toastConfig, setTasks]);

  const hideToast = useCallback(() => {
    setToastConfig(prev => prev ? { ...prev, visible: false } : null);
  }, []);

  const moveTask = useCallback((taskId: string, sourceColId: string, destColId: string, newOrder: number) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      const task = newTasks[taskId];
      if (!task) return prev;

      // Decrement order for tasks in source column after the moved task
      Object.values(newTasks)
        .filter(t => t.columnId === sourceColId && t.order > task.order && t.id !== taskId)
        .forEach(t => { t.order -= 1; });

      Object.values(newTasks)
        .filter(t => t.columnId === destColId && t.order >= newOrder && t.id !== taskId)
        .forEach(t => { t.order += 1; });

      task.columnId = destColId;
      task.order = newOrder;

      const destCol = columns[destColId];
      if (destCol) {
        const destTitle = destCol.title.toLowerCase();
        if (destTitle.includes('done') || destTitle.includes('completed')) {
          task.completed = true;
        } else {
          task.completed = false;
        }
      }

      return newTasks;
    });
  }, [setTasks, columns]);

  const reorderTask = useCallback((colId: string, startIndex: number, endIndex: number) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      const colTasks = Object.values(newTasks)
        .filter(t => t.columnId === colId)
        .sort((a, b) => a.order - b.order);
      
      const [removed] = colTasks.splice(startIndex, 1);
      colTasks.splice(endIndex, 0, removed);
      
      colTasks.forEach((t, idx) => {
        t.order = idx;
      });
      return newTasks;
    });
  }, [setTasks]);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => {
      const task = prev[id];
      if (!task) return prev;

      const isCompleting = !task.completed;
      let newColumnId = task.columnId;
      let prevColumnId = task.previousColumnId || task.columnId;

      if (isCompleting) {
        prevColumnId = task.columnId;
        const doneCol = Object.values(columns).find(c => c.title.toLowerCase() === 'done' || c.title.toLowerCase() === 'completed') 
                        || columns[columnOrder[columnOrder.length - 1]];
        if (doneCol) {
          newColumnId = doneCol.id;
        }
      } else {
        if (columns[prevColumnId]) {
          newColumnId = prevColumnId;
        } else {
          newColumnId = columnOrder[0];
        }
      }

      return {
        ...prev,
        [id]: { 
          ...task, 
          completed: isCompleting,
          columnId: newColumnId,
          previousColumnId: prevColumnId,
          order: 999 
        }
      };
    });
  }, [setTasks, columns, columnOrder]);

  const addColumn = useCallback((title: string) => {
    const newColId = `col-${uuidv4()}`;
    const newCol = { id: newColId, title: title.trim(), order: columnOrder.length };
    setColumns(prev => ({ ...prev, [newColId]: newCol }));
    setColumnOrder(prev => [...prev, newColId]);
  }, [columnOrder, setColumns, setColumnOrder]);

  const deleteColumn = useCallback((id: string) => {
    if (activeColumnId === id) setActiveColumnId(null);
    setColumns(prev => {
      const newCols = { ...prev };
      delete newCols[id];
      return newCols;
    });
    setColumnOrder(prev => prev.filter(colId => colId !== id));
    setTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(taskId => {
        if (newTasks[taskId].columnId === id) delete newTasks[taskId];
      });
      return newTasks;
    });
  }, [setColumns, setColumnOrder, setTasks, activeColumnId]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setFilterType = useCallback((newFilter: AppState['filter']) => {
    setFilter(newFilter);
  }, [setFilter]);

  const state = useMemo(() => ({
    tasks,
    columns,
    columnOrder,
    theme,
    filter
  }), [tasks, columns, columnOrder, theme, filter]);

  const value = useMemo(() => ({
    state,
    addTask,
    updateTask,
    deleteTask,
    deleteTaskWithUndo,
    moveTask,
    reorderTask,
    toggleComplete,
    addColumn,
    deleteColumn,
    setFilter: setFilterType,
    toggleTheme,
    activeTaskDetail,
    setActiveTaskDetail,
    activeColumnId,
    setActiveColumnId,
    toastConfig,
    hideToast,
    undoDelete,
  }), [state, addTask, updateTask, deleteTask, deleteTaskWithUndo, moveTask, reorderTask, toggleComplete, addColumn, deleteColumn, setFilterType, toggleTheme, activeTaskDetail, activeColumnId, toastConfig, hideToast, undoDelete]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
