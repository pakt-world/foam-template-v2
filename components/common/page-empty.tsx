import React from 'react';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import empty from '@/lottiefiles/empty.json';

interface Props {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageEmpty: React.FC<Props> = ({ className, label, children }) => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn('flex h-screen w-full items-center justify-center bg-white border', className)}
    >
      <div className="items-center flex-col flex">
        <div className="max-w-[250px] w-full flex items-center justify-center">
          <Lottie animationData={empty} loop={false} />
        </div>
        <span className="text-body text-lg text-center max-w-md">{label || 'Nothing to show yet.'}</span>
        {children}
      </div>
    </div>
  );
};
