import { ComponentProps, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ComposerState, SendMessageFunc } from '../lib/types';
import { LoaderCircleIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposerContextProps {
  state: ComposerState;
  setValue: (value: string) => void;
  submit: () => void;
  canSubmit: boolean;
  addAttachment?: (file: File) => void;
  removeAttachment?: (id: string) => void;
}

const ComposerContext = createContext<ComposerContextProps | null>(null);

export interface ComposerProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: SendMessageFunc;
}

export function Composer({ onSubmit, className, children, ...props }: ComposerProps) {
  const [state, setState] = useState<ComposerState>({
    value: '',
    isSubmitting: false,
  });

  const setValue = useCallback((value: string) => {
    setState((prev) => ({ ...prev, value }));
  }, []);

  const submit = useCallback(async () => {
    if (!state.value.trim() || state.isSubmitting) return;

    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await onSubmit(state.value);
      setState({ value: '', isSubmitting: false });
    } catch {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [state.value, state.isSubmitting, onSubmit]);

  const canSubmit = state.value.trim().length > 0 && !state.isSubmitting;

  const memoizedValue = useMemo(
    () => ({ state, setValue, submit, canSubmit }),
    [state, setValue, submit, canSubmit],
  );

  return (
    <ComposerContext.Provider value={memoizedValue}>
      <div
        className={cn(
          'relative rounded-2xl border bg-background p-3',
          'focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ComposerContext.Provider>
  );
}

export type ComposerInputProps = Omit<ComponentProps<'textarea'>, 'value' | 'onChange'>;

export function ComposerInput({
  className,
  onKeyDown,
  placeholder = 'Ask something...',
  ...props
}: ComposerInputProps) {
  const { state, setValue, submit, canSubmit } = useComposer();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (canSubmit) submit();
      }
      onKeyDown?.(e);
    },
    [canSubmit, submit, onKeyDown],
  );

  return (
    <textarea
      className={cn(
        'min-h-10 w-full resize-none bg-transparent px-1 text-sm',
        'placeholder:text-muted-foreground focus:outline-none',
        'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
        className,
      )}
      value={state.value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={state.isSubmitting}
      placeholder={placeholder}
      {...props}
    />
  );
}

export type ComposerFooterProps = ComponentProps<'div'>;

export function ComposerFooter({ className, children, ...props }: ComposerFooterProps) {
  return (
    <div className={cn('flex items-center justify-between pt-2', className)} {...props}>
      {children}
    </div>
  );
}

export type ComposerSubmitProps = ComponentProps<'button'>;

export function ComposerSubmit({ className, children, ...props }: ComposerSubmitProps) {
  const { submit, canSubmit, state } = useComposer();

  return (
    <button
      type="button"
      onClick={submit}
      disabled={!canSubmit}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'bg-muted text-muted-foreground',
        'hover:bg-accent hover:text-foreground',
        'disabled:opacity-50 disabled:pointer-events-none',
        'transition-all focus:outline-none focus:ring-2 focus:ring-ring',
        canSubmit && 'bg-foreground text-background hover:bg-foreground/90',
        className,
      )}
      {...props}
    >
      {state.isSubmitting ?
        <LoaderCircleIcon className="size-4 animate-spin" />
      : children || <ArrowUpIcon className="size-4" />}
    </button>
  );
}

export function useComposer() {
  const ctx = useContext(ComposerContext);
  if (!ctx) throw new Error('useComposer must be used within a Composer');
  return ctx;
}
