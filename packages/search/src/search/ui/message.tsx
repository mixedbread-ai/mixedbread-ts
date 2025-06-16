import { ComponentProps, createContext, useContext, useState } from 'react';
import { type Message as MessageType } from '../lib/types';
import { UserIcon, BotIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextShimmer } from './text-shimmer';

interface MessageContextProps {
  message: MessageType;
  isLast: boolean;
}

export const MessageContext = createContext<MessageContextProps | null>(null);

export function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex gap-3">
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-muted')}>
        <BotIcon className="size-4" />
      </div>
      <div className="flex grow flex-col">
        <div className="rounded-md px-3 py-2 bg-muted self-start">
          <p className="text-sm">{content}</p>
        </div>
        <MessageFooter>
          <MessageCopy />
        </MessageFooter>
      </div>
    </div>
  );
}

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex gap-3">
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background',
        )}
      >
        <UserIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="rounded-md px-3 py-2 bg-foreground text-background">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}

export type PendingMessageProps = ComponentProps<'div'>;

export function PendingMessage({ className, ...props }: PendingMessageProps) {
  return (
    <div className={cn('flex gap-3', className)} {...props}>
      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full bg-muted')}>
        <BotIcon className="size-4" />
      </div>
      <div className="pb-10 pt-0.5">
        <TextShimmer className="text-sm">Thinking...</TextShimmer>
      </div>
    </div>
  );
}

export type MessageProps = MessageType & {
  UserMessage: typeof UserMessage;
  AssistantMessage: typeof AssistantMessage;
  PendingMessage: typeof PendingMessage;
};

export function Message({ role, content, status, UserMessage, AssistantMessage }: MessageProps) {
  const isUser = role === 'user';

  if (status === 'pending') {
    return <PendingMessage />;
  }

  if (isUser) {
    return <UserMessage content={content} />;
  }

  return <AssistantMessage content={content} />;
}

export interface MessageContentProps extends ComponentProps<'div'> {
  content: string;
}

export function MessageContent({ content, className, ...props }: MessageContentProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)} {...props}>
      <p className="text-sm">{content}</p>
    </div>
  );
}

export function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessage must be used within a Message');
  return ctx;
}

export type MessageFooterProps = ComponentProps<'div'>;

export function MessageFooter({ className, children, ...props }: MessageFooterProps) {
  return (
    <div className={cn('flex items-center gap-1 mt-1', className)} {...props}>
      {children}
    </div>
  );
}

export type MessageCopyProps = Omit<ComponentProps<'button'>, 'onClick'> & {
  content?: string;
};

export function MessageCopy({ content, className, ...props }: MessageCopyProps) {
  const [copied, setCopied] = useState(false);
  const { message } = useMessage();
  const textToCopy = content || message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center rounded size-5',
        'text-muted-foreground hover:text-foreground hover:bg-accent',
        'transition-all focus:outline-none focus:ring-1 focus:ring-ring',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...props}
    >
      {copied ?
        <CheckIcon className="size-3.5" />
      : <CopyIcon className="size-3.5" />}
      <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
