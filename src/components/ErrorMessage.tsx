import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
      <p className="text-sm text-[var(--mac-text-secondary)] mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mac-button flex items-center space-x-2">
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};