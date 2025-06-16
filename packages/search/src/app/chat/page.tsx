'use client';

import { useChatDemo } from '@/search/hooks/use-chat-demo';
import {
  Composer,
  ComposerInput,
  ComposerFooter,
  ComposerSubmit,
  ComposerSuggestions,
  ComposerSuggestionItem,
} from '@/search/ui/composer';
import { Thread, ThreadViewport, ThreadMessages, ThreadScrollToBottom, ThreadIf } from '@/search/ui/thread';

export default function ChatDemoPage() {
  const { thread, sendMessage, isLoading } = useChatDemo();

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-2xl rounded-lg border bg-background shadow-sm">
        <Thread thread={thread} isLoading={isLoading}>
          <ThreadViewport className="h-[600px]">
            <ThreadMessages />

            <ThreadScrollToBottom />

            <ThreadIf empty>
              <ComposerSuggestions>
                <ComposerSuggestionItem>
                  <span className="line-clamp-1">How do I implement semantic search?</span>
                </ComposerSuggestionItem>

                <ComposerSuggestionItem>
                  <span className="line-clamp-1">What are the benefits of vector databases?</span>
                </ComposerSuggestionItem>

                <ComposerSuggestionItem>
                  <span className="line-clamp-1">Explain RAG architecture patterns</span>
                </ComposerSuggestionItem>

                <ComposerSuggestionItem>
                  <span className="line-clamp-1">Show me TypeScript best practices</span>
                </ComposerSuggestionItem>
              </ComposerSuggestions>
            </ThreadIf>
          </ThreadViewport>

          <div className="border-t p-4">
            <Composer onSubmit={sendMessage}>
              <ComposerInput />
              <ComposerFooter className="justify-end">
                <ComposerSubmit />
              </ComposerFooter>
            </Composer>
          </div>
        </Thread>
      </div>
    </div>
  );
}
