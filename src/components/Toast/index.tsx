import React, { useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { LayoutGrid } from 'lucide-react';

export default function Toast() {
  const { toastConfig, hideToast, undoDelete } = useTaskContext();

  useEffect(() => {
    if (toastConfig?.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastConfig, hideToast]);

  if (!toastConfig || !toastConfig.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-surface-bright rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-outline-variant/20 p-4 min-w-[320px] max-w-[400px] flex gap-4 pr-6">
        <div className="flex-shrink-0 pt-0.5">
          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
             <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="flex-1 pb-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-[14px] text-on-surface">Task deleted</h4>
            <button 
              onClick={undoDelete}
              className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Undo
            </button>
          </div>
          {toastConfig.subMessage && (
            <p className="text-[13px] text-outline-variant leading-snug pr-4">
              {toastConfig.subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
