import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { Check, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
}

function TaskCardComponent({ task, index }: TaskCardProps) {
  const { toggleComplete, setActiveTaskDetail, activeTaskDetail } = useTaskContext();
  const [isNew, setIsNew] = useState(true);

  const isActive = activeTaskDetail === task.id;

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 220);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setActiveTaskDetail(isActive ? null : task.id)}
          className={`
            bg-surface-bright rounded-xl p-4 cursor-pointer group transition-all duration-200 relative
            ${isNew ? 'animate-task-enter' : ''}
            ${snapshot.isDragging ? 'shadow-2xl scale-[1.03] rotate-[1.5deg] z-50 ring-2 ring-primary/20' : 'shadow-[0_1px_3px_rgba(0,0,0,0.04)]'}
            ${isActive && !snapshot.isDragging ? 'ring-2 ring-primary border-primary' : 'border border-outline-variant/30 hover:border-outline-variant/50'}
          `}
          style={{
            ...provided.draggableProps.style,
            width: '308px',
            maxWidth: '308px',
            maxHeight: '200px',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxHeight: '160px', overflow: 'hidden' }}>
            {/* Title */}
            <h3
              title={task.title}
              style={{
                fontWeight: 500,
                fontSize: '15px',
                lineHeight: '1.4',
                margin: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
              }}
              className="text-on-surface font-body"
            >
              {task.title}
            </h3>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', overflow: 'hidden', maxHeight: '46px' }}>
                {task.tags.map((tag, i) => {
                  const isBlue = i % 2 === 0;
                  return (
                    <span
                      key={tag}
                      title={tag}
                      style={{
                        maxWidth: '110px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                      }}
                      className={isBlue
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      }
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Description */}
            {task.description && (
              <p
                title={task.description}
                style={{
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  opacity: task.completed ? 0.6 : 1,
                }}
                className="text-on-surface-variant"
              >
                {task.description}
              </p>
            )}
          </div>

          {/* Bottom row: checkbox + drag handle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                border: task.completed ? 'none' : '1.5px solid var(--outline-variant)',
                background: task.completed ? '#22c55e' : 'white',
                color: 'white', cursor: 'pointer',
              }}
            >
              {task.completed && <Check strokeWidth={3} style={{ width: '11px', height: '11px' }} />}
            </button>
            <div style={{ opacity: 0.4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="8" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="19" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

const TaskCard = React.memo(TaskCardComponent);
export default TaskCard;
