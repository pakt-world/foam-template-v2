/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    className?: string;
    children: React.ReactNode;
    onOpenChange: (open: boolean) => void;
    disableClickOutside?: boolean;
}

export const Modal: FC<Props> = ({ children, isOpen, onOpenChange, className, disableClickOutside }) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-transparent duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[50%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[50%]",
                        className,
                    )}
                    onInteractOutside={(e) => {
                        if (disableClickOutside) {
                            e.preventDefault();
                        }
                    }}
                >
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
