import React from 'react';
import { useTaskContext } from '../../context/TaskContext';

export default function FilterBar() {
  const { state: { filter }, setFilter } = useTaskContext();

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ] as const;

  return (
    <div className="flex mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-1 p-1 bg-surface-bright rounded-full border border-outline-variant/30 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-fit">
        {filters.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
