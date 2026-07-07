import { ComponentProps, createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';
import { ComposerState, SendMessageFunc } from '../lib/types';
import { LoaderCircleIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThread } from './thread';

interface ComposerContextProps {
  state: ComposerState;
  setState: (value: string) => void;
  submit: (value?: string) => Promise<void>;
  canSubmit: boolean;
}

const ComposerContext = createContext<ComposerContextProps | null>(null);

export type ComposerProps = Omit<ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: SendMessageFunc;
};

export function Composer({ onSubmit, className, children, ...props }: ComposerProps) {
  const [state, setState] = useState<ComposerState>({
    value: '',
    isSubmitting: false,
  });

  const setValue = useCallback((value: string) => {
    setState((prev) => ({ ...prev, value }));
  }, []);

  const submit = useCallback(
    async (value?: string) => {
      const submittedValue = value || state.value;
      if (!submittedValue.trim() || state.isSubmitting) return;

      setState((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSubmit(submittedValue);
        setState({ value: '', isSubmitting: false });
      } catch {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.value, state.isSubmitting, onSubmit],
  );

  const canSubmit = state.value.trim().length > 0 && !state.isSubmitting;

  const memoizedValue = useMemo(
    () => ({ state, setState: setValue, submit, canSubmit }),
    [state, setValue, submit, canSubmit],
  );

  return (
    <ComposerContext.Provider value={memoizedValue}>
      <div className={cn('relative', className)} {...props}>
        {children}
      </div>
    </ComposerContext.Provider>
  );
}

export type ComposerFormProps = ComponentProps<'form'>;

export function ComposerForm({ className, children, ...props }: ComposerFormProps) {
  const { submit } = useComposer();

  return (
    <form
      className={cn(
        'relative rounded-lg border p-3',
        'focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background',
        className,
      )}
      onSubmit={() => submit()}
      {...props}
    >
      {children}
    </form>
  );
}

export type ComposerSuggestionsProps = ComponentProps<'div'>;

export function ComposerSuggestions({ className, children, ...props }: ComposerSuggestionsProps) {
  return (
    <div
      className={cn('absolute bottom-3 grid grid-cols-1 inset-x-4 sm:grid-cols-2 gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type ComposerSuggestionItemProps = ComponentProps<'button'> & {
  value: string;
};

export function ComposerSuggestionItem({
  className,
  value,
  children,
  ...props
}: ComposerSuggestionItemProps) {
  const { sendMessage } = useThread();

  return (
    <button
      type="button"
      className={cn(
        'w-full text-left rounded-lg border bg-background p-3 text-sm text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground',
        'focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
        className,
      )}
      onClick={() => sendMessage(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export type ComposerInputProps = Omit<ComponentProps<'textarea'>, 'value' | 'onChange'>;

export function ComposerInput({
  className,
  onKeyDown,
  placeholder = 'Ask a question...',
  ...props
}: ComposerInputProps) {
  const { state, setState, submit, canSubmit } = useComposer();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (canSubmit) {
          submit().then(() => {
            textareaRef.current?.focus();
          });
        }
      }
      onKeyDown?.(e);
    },
    [canSubmit, submit, onKeyDown],
  );

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        'min-h-10 field-sizing-content w-full resize-none bg-transparent px-1 text-sm',
        'placeholder:text-muted-foreground focus:outline-none',
        className,
      )}
      value={state.value}
      onChange={(e) => setState(e.target.value)}
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
      onClick={() => submit()}
      disabled={!canSubmit}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 bg-foreground text-background hover:bg-foreground/90',
        'transition-all focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background',
        'disabled:opacity-50 disabled:pointer-events-none',
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
