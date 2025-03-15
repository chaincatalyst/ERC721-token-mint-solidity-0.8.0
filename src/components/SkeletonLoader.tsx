import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'table-row' | 'chart';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="mac-panel p-4 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[var(--mac-metal)] rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-[var(--mac-metal)] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[var(--mac-metal)] rounded w-2/3" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[var(--mac-metal)] rounded" />
              ))}
            </div>
          </div>
        );

      case 'table-row':
        return (
          <tr className="animate-pulse">
            <td className="py-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-[var(--mac-metal)] rounded-full" />
                <div className="h-4 bg-[var(--mac-metal)] rounded w-24" />
              </div>
            </td>
            <td><div className="h-4 bg-[var(--mac-metal)] rounded w-16" /></td>
            <td><div className="h-4 bg-[var(--mac-metal)] rounded w-20" /></td>
            <td><div className="h-4 bg-[var(--mac-metal)] rounded w-24" /></td>
            <td><div className="h-4 bg-[var(--mac-metal)] rounded w-12" /></td>
            <td><div className="h-4 bg-[var(--mac-metal)] rounded w-16" /></td>
          </tr>
        );

      case 'chart':
        return (
          <div className="mac-panel p-4 animate-pulse">
            <div className="h-48 bg-[var(--mac-metal)] rounded" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};