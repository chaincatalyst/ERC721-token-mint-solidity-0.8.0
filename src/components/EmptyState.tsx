import React from 'react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Info className="w-8 h-8 text-[var(--mac-text-secondary)] mb-4" />
      <p className="text-sm font-medium mb-2">{message}</p>
      {description && (
        <p className="text-xs text-[var(--mac-text-secondary)] mb-4">{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="mac-button">
          {action.label}
        </button>
      )}
    </div>
  );
};