import React from 'react';
import { Moon, Sun, Menu, User } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export default function NavBar() {
  const { state: { theme }, toggleTheme } = useTaskContext();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-surface">
      <div className="flex items-baseline gap-4">
        <button className="p-2 hover:bg-surface-container rounded-full transition-colors md:hidden">
          <Menu className="w-5 h-5 text-on-surface" />
        </button>
        <div className="hidden md:flex items-baseline gap-6">
          <span className="font-display text-6xl font-bold [text-shadow:0_4px_10px_rgba(0,0,0,0.3)] text-on-surface tracking-tight">
            Panels
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border-2 border-surface flex items-center justify-center">
            <User className="w-5 h-5 text-on-surface-variant" />
        </div>
      </div>
    </nav>
  );
}
