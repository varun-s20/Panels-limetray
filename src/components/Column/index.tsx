import React, { useMemo, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column as ColumnType, AppState } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import TaskCard from '../TaskCard';
import AddTaskInput from '../AddTaskInput';
import { MoreHorizontal, ChevronDown, ChevronRight, ClipboardList, Trash2 } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  filter: AppState['filter'];
}

function ColumnComponent({ column, filter }: ColumnProps) {
  const { state: { tasks }, activeColumnId, setActiveColumnId, deleteColumn } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const columnTasks = useMemo(() => {
    return Object.values(tasks)
      .filter((t) => t.columnId === column.id)
      .filter((t) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [tasks, column.id, filter]);

  const isActive = activeColumnId === column.id;

  const isDoneColumn = column.title.toLowerCase() === 'done' || column.title.toLowerCase() === 'completed';
  const canAddTask = !(filter === 'pending' && isDoneColumn) && !(filter === 'completed' && !isDoneColumn);

  return (
    <div 
      className={`flex flex-col bg-transparent w-[340px] flex-shrink-0 md:bg-surface-container-low/70 md:rounded-xl md:p-3 h-fit max-h-full transition-all
        ${isActive ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-surface-bright ring-1 ring-outline-variant/20 -translate-y-1' : 'border border-transparent'}
      `}
      onClick={() => setActiveColumnId(isActive ? null : column.id)}
    >
      {/* Column Header */}
      <div 
        className="flex items-center justify-between py-2 md:py-3 mb-2 px-2 cursor-pointer transition-colors hover:bg-surface-container/50 rounded-lg group"
      >
        <div className="overflow-hidden min-w-0 flex-1" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          <div className="flex items-center gap-2">
            {/* Mobile Expander Icon */}
            <div className="md:hidden text-on-surface-variant cursor-pointer shrink-0">
              {isExpanded ? <ChevronDown className="w-5 h-5"/> : <ChevronRight className="w-5 h-5"/>}
            </div>
            <h2
              className="font-display font-semibold text-[15px] text-on-surface"
              title={column.title}
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}
            >
              {column.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isActive ? (
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 const confirmDelete = window.confirm(`Are you sure you want to delete the column "${column.title}" and all its tasks?`);
                 if (confirmDelete) deleteColumn(column.id);
               }}
               className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors z-10"
               title="Delete Column"
             >
               <Trash2 className="w-4 h-4" />
             </button>
          ) : (
            <span className="bg-surface-container-high/80 text-on-surface-variant/80 px-1.5 py-0.5 rounded-full text-[11px] font-semibold min-w-[20px] text-center transition-all group-hover:bg-surface-container-high/100">
              {columnTasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Task List (collapsible on mobile) */}
      <div className={`flex-1 flex col-tasks ${isExpanded ? 'block' : 'hidden md:flex'}`}>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex flex-col gap-3 min-h-[150px] transition-colors rounded-xl p-1 pb-4 w-full overflow-hidden
                ${snapshot.isDraggingOver ? 'bg-primary/5 border-l-2 border-primary' : ''}
              `}
            >
              {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center mt-4">
                   <div className="w-[52px] h-[52px] bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                     <ClipboardList className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
                   </div>
                   <p className="text-[14px] font-medium text-on-surface-variant">Nothing here yet</p>
                   <p className="text-[12px] text-outline-variant mt-1.5">Click below to add your first task</p>
                </div>
              )}
              {columnTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
              {canAddTask && (
                <div className="mt-2 text-on-surface-variant/70">
                  <AddTaskInput columnId={column.id} />
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}

const Column = React.memo(ColumnComponent);
export default Column;
