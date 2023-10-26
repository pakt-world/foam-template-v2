'use client';

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
  children?: React.ReactNode;
  disableClickOutside?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen, closeModal, className, disableClickOutside }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          if (!disableClickOutside) {
            closeModal();
          }
        }}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full max-w-lg bg-transparent transform overflow-hidden text-left align-middle transition-all',
                  className,
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
