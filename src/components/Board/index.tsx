import React, { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTaskContext } from '../../context/TaskContext';
import Column from '../Column';
import TaskDetailPanel from '../TaskDetailPanel';
import { Plus } from 'lucide-react';

export default function Board() {
  const { state: { columnOrder, columns, filter }, moveTask, reorderTask, activeTaskDetail, addColumn } = useTaskContext();

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      reorderTask(source.droppableId, source.index, destination.index);
    } else {
      moveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
    }
  }, [moveTask, reorderTask]);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-x-auto overflow-y-hidden pb-4 snap-x">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            if (!column) return null;
            return <Column key={column.id} column={column} filter={filter} />;
          })}
          
          <div className="flex-shrink-0 w-full md:w-[340px]">
            <button 
              onClick={() => {
                const name = window.prompt("Enter new column name:");
                if (name) addColumn(name);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-surface-bright/50 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-bright transition-colors border-dashed"
            >
              <Plus className="w-4 h-4 text-outline" />
              <span className="font-medium text-[14px]">Add column</span>
            </button>
          </div>
        </div>
      </DragDropContext>

      {/* Slide-over Detail Panel */}
      <TaskDetailPanel isOpen={!!activeTaskDetail} taskId={activeTaskDetail} />
    </div>
  );
}
