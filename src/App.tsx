import React from 'react';
import { TaskProvider } from './context/TaskContext';
import NavBar from './components/NavBar';
import FilterBar from './components/FilterBar';
import Board from './components/Board';
import Toast from './components/Toast';
import { Menu } from 'lucide-react';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <NavBar />
      <div className="flex-1 flex flex-col mx-4 md:mx-8 mb-6 mt-4">
        <FilterBar />
        <Board />
      </div>
      <Toast />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
