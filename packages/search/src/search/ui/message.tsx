import { ComponentProps, createContext, ReactNode, useContext } from 'react';
import { type Message as MessageType } from '../lib/types';
import { UserIcon, BotIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="flex flex-col gap-2">
        <div className="rounded-lg px-3 py-2 bg-muted">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}

export function UserMessage({ content }: { content: string }) {
  return (
    <div className={cn('flex gap-3')}>
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background',
        )}
      >
        <UserIcon className="size-4" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="rounded-lg px-3 py-2 bg-foreground text-background">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}

export type MessageProps = MessageType & {
  UserMessage: (props: { content: string }) => ReactNode;
  AssistantMessage: (props: { content: string }) => ReactNode;
};

export function Message({ role, content, UserMessage, AssistantMessage }: MessageProps) {
  const isUser = role === 'user';

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
