import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface Props {
  className?: string;
}

export const PageError: React.FC<Props> = ({ className }) => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn('flex h-screen w-full items-center justify-center bg-transparent bg-red-50', className)}
    >
      <div className="flex flex-col items-center gap-2 text-center text-red-500">
        <AlertCircle size={60} strokeWidth={1} />
        <p className="text-lg">Something went wrong. Please try again later.</p>
      </div>
    </div>
  );
};
