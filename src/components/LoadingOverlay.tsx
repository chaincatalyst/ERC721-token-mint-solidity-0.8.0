import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--mac-window-bg)] bg-opacity-80 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};