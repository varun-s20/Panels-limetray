import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { X, AlignLeft, Tag as TagIcon, Flag, Plus, Trash2 } from 'lucide-react';

interface TaskDetailPanelProps {
  isOpen: boolean;
  taskId: string | null;
}

export default function TaskDetailPanel({ isOpen, taskId }: TaskDetailPanelProps) {
  const { state: { tasks, columns }, updateTask, setActiveTaskDetail, deleteTaskWithUndo } = useTaskContext();
  const task = taskId ? tasks[taskId] : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsAddingTag(false);
      setNewTag('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleAddTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      updateTask(task.id, { tags: [...task.tags, newTag.trim()] });
    }
    setNewTag('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateTask(task.id, { tags: task.tags.filter(t => t !== tagToRemove) });
  };
  
  const columnRef = columns[task.columnId];

  let statusColorClass = 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'; 
  const normalizedTitle = columnRef?.title?.toLowerCase() || '';
  if (normalizedTitle.includes('todo') || normalizedTitle.includes('to do')) {
    statusColorClass = 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  } else if (normalizedTitle.includes('done') || normalizedTitle.includes('completed')) {
    statusColorClass = 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400';
  } else if (normalizedTitle.includes('progress')) {
    statusColorClass = 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-[1px] z-40 transition-opacity animate-in fade-in duration-200"
        onClick={() => setActiveTaskDetail(null)}
      />
      <div 
        className={`
          fixed right-0 top-0 h-full w-full md:w-[480px] bg-surface-bright 
          shadow-[0_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => {
                deleteTaskWithUndo(task.id);
              }}
              className="px-3 py-1.5 flex items-center gap-1.5 rounded-md bg-red-50/50 text-red-500 hover:bg-red-100 transition-colors text-sm font-semibold"
            >
              <Trash2 className="w-4 h-4" /> Delete Card
            </button>
            <button 
              onClick={() => setActiveTaskDetail(null)}
              className="p-1 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="mb-4">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if(title.trim()) updateTask(task.id, { title: title.trim() });
              }}
              rows={2}
              className="w-full font-display font-bold uppercase text-[32px] leading-[1.1] text-on-surface bg-transparent focus:outline-none resize-none  overflow-hidden"
              style={{ padding: 0 }}
            />
          </div>

          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusColorClass}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {columnRef ? columnRef.title : (task.completed ? 'Completed' : 'To Do')}
            </span>
          </div>

          <div className="space-y-10">
            {/* Description Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
                <AlignLeft className="w-[18px] h-[18px]" strokeWidth={2} />
                <h3 className="font-semibold text-[15px]">Description</h3>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => updateTask(task.id, { description: description.trim() })}
                placeholder="Type '/' for commands..."
                className="w-full min-h-[140px] bg-transparent text-[15px] leading-relaxed text-on-surface placeholder:text-outline-variant/70 focus:outline-none resize-none transition-all py-1"
              />
            </div>
            
            {/* Tags Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <TagIcon className="w-[18px] h-[18px]" strokeWidth={2} />
                <h3 className="font-semibold text-[15px]">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                {task.tags.map((tag, i) => {
                  const isBlue = i % 2 === 0;
                  return (
                    <span
                      key={tag}
                      title={tag}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold tracking-wide ${
                        isBlue
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}
                      style={{ maxWidth: '180px' }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {tag}
                      </span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-black/10 rounded-full p-0.5 shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                
                {isAddingTag ? (
                  <div className="flex items-center gap-2 bg-surface-container-low rounded-md px-2 py-1">
                    <input 
                      autoFocus
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTag();
                        if (e.key === 'Escape') setIsAddingTag(false);
                      }}
                      onBlur={handleAddTag}
                      placeholder="Tag name"
                      className="bg-transparent text-sm w-24 outline-none text-on-surface"
                    />
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors text-[13px] font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5 outline outline-[1px] outline-outline-variant/40 rounded-sm" /> Add tag
                  </button>
                )}
              </div>
            </div>

            {/* Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <Flag className="w-[18px] h-[18px]" strokeWidth={2} />
                <h3 className="font-semibold text-[15px]">Priority</h3>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(p => {
                  const isActive = task.priority === p;
                  let dotColor = 'bg-primary';
                  if (p === 'low') dotColor = 'bg-green-500';
                  if (p === 'medium') dotColor = 'bg-orange-500';
                  if (p === 'high') dotColor = 'bg-red-500';

                  return (
                    <button
                      key={p}
                      onClick={() => updateTask(task.id, { priority: p })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold capitalize transition-all ${
                        isActive 
                          ? 'border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.06)] bg-surface text-on-surface ring-1 ring-outline-variant/20' 
                          : 'border-transparent bg-transparent text-on-surface-variant hover:bg-surface-container/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
