import { ComponentProps, createContext, ReactNode, useContext } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface DialogContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SearchDialogProps extends DialogContextProps {
  children: ReactNode;
}

const DialogContext = createContext<DialogContextProps | null>(null);

export function SearchDialog({ children, open, onOpenChange }: SearchDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function SearchDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-2 px-4', className)} {...props} />;
}

export function SearchDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mt-auto border-t border-border/60 p-4', className)} {...props} />;
}

export function SearchDialogContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Content
      className={cn(
        '-translate-x-1/2 fixed top-[10vh] left-1/2 z-50 w-[98vw] max-w-screen-sm rounded-lg border bg-popover shadow-lg',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      aria-describedby={undefined}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  );
}

export function SearchDialogOverlay(props: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in supports-[backdrop-filter]:bg-black/20',
        props.className,
      )}
    />
  );
}

export function useSearchDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useSearchDialog must be used within a SearchDialog');
  return ctx;
}
