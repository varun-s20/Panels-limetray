import React, { useState, useRef } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { Plus } from 'lucide-react';

interface AddTaskInputProps {
  columnId: string;
}

export default function AddTaskInput({ columnId }: AddTaskInputProps) {
  const { addTask } = useTaskContext();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    addTask(columnId, trimmed);
    setTitle('');
    setIsAdding(false);
    setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndSubmit();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
      setError(false);
    }
  };

  if (!isAdding) {
    return (
      <button 
        onClick={() => setIsAdding(true)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors group"
      >
        <Plus className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
        <span>Add a task</span>
      </button>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-3 shadow-sm border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <input
        ref={inputRef}
        autoFocus
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError(false);
        }}
        onBlur={() => {
          if (title.trim()) {
            validateAndSubmit();
          } else {
            setIsAdding(false);
            setError(false);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        className={`w-full bg-transparent text-sm text-on-surface placeholder:text-outline outline-none ${
          error ? 'animate-shake' : ''
        }`}
      />
      {error && (
        <p className="mt-2 text-xs text-error font-medium">Task title cannot be empty.</p>
      )}
    </div>
  );
}
