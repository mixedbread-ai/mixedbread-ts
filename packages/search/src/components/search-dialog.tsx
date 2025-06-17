'use client';

import { useSearch } from '@/search/hooks/use-search';
import { SearchIndicatorIcon, SearchInput, SearchList, Search, TagsList } from '@/search/ui/search';
import { MxbaiLogoIcon } from './mxbai-logo-icon';
import { mockResults, mockTags } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogOverlay,
} from '@/search/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatDemo } from '@/search/hooks/use-chat-demo';
import {
  Composer,
  ComposerInput,
  ComposerFooter,
  ComposerSubmit,
  ComposerSuggestions,
  ComposerSuggestionItem,
  ComposerForm,
} from '@/search/ui/composer';
import { Thread, ThreadViewport, ThreadMessages, ThreadScrollToBottom, ThreadIf } from '@/search/ui/thread';
import { MessageSquareIcon } from 'lucide-react';
import { useMeasure } from '@/search/hooks/use-measure';
import { motion } from 'motion/react';

export function CustomSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(mockTags[0]);
  const { thread, sendMessage, isLoading: isChatLoading } = useChatDemo();
  const [activeTab, setActiveTab] = useState('search');

  const [ref, dimensions] = useMeasure<HTMLDivElement>();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const mockedResults = mockResults(results);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'search') {
        searchInputRef.current?.focus();
      } else {
        chatInputRef.current?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <SearchDialog {...props}>
      <SearchDialogOverlay />

      <SearchDialogContent className="max-w-3xl">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: dimensions.height, opacity: 1 }}
          className="overflow-hidden"
        >
          <div ref={ref}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-0">
              <Search
                search={search}
                onSearchChange={setSearch}
                results={mockedResults}
                isLoading={isLoading}
                tag={selectedTag}
                onTagChange={setSelectedTag}
              >
                <SearchDialogHeader>
                  {activeTab === 'search' ?
                    <>
                      <SearchIndicatorIcon />
                      <SearchInput ref={searchInputRef} className="focus-visible:outline-none py-3" />
                    </>
                  : <div className="py-3 text-muted-foreground flex items-center gap-2">
                      <MessageSquareIcon className="size-4" />
                      <span className="text-muted-foreground">Chat</span>
                    </div>
                  }

                  <TabsList className="absolute right-4">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                </SearchDialogHeader>

                <TabsContent value="search">
                  <TagsList allowClear={true} className="border-b border-border/60" />

                  <SearchList items={mockedResults} className="max-h-[400px]" />
                </TabsContent>
              </Search>

              <TabsContent value="chat" className="mt-0">
                <Thread thread={thread} isLoading={isChatLoading} sendMessage={sendMessage}>
                  <ThreadViewport className="h-[400px]">
                    <ThreadMessages />
                    <ThreadScrollToBottom />

                    <ThreadIf empty>
                      <ComposerSuggestions>
                        <ComposerSuggestionItem
                          value="How do I implement semantic search?"
                          className="bg-background/10"
                        >
                          <span className="line-clamp-1">How do I implement semantic search?</span>
                        </ComposerSuggestionItem>

                        <ComposerSuggestionItem
                          value="What are the benefits of vector databases?"
                          className="bg-background/10"
                        >
                          <span className="line-clamp-1">What are the benefits of vector databases?</span>
                        </ComposerSuggestionItem>

                        <ComposerSuggestionItem
                          value="Explain RAG architecture patterns"
                          className="bg-background/10"
                        >
                          <span className="line-clamp-1">Explain RAG architecture patterns</span>
                        </ComposerSuggestionItem>

                        <ComposerSuggestionItem value="Show me code examples" className="bg-background/10">
                          <span className="line-clamp-1">Show me code examples</span>
                        </ComposerSuggestionItem>
                      </ComposerSuggestions>
                    </ThreadIf>
                  </ThreadViewport>

                  <div className="border-t border-border/60 p-4">
                    <Composer onSubmit={sendMessage}>
                      <ComposerForm>
                        <ComposerInput ref={chatInputRef} />
                        <ComposerFooter className="justify-end">
                          <ComposerSubmit />
                        </ComposerFooter>
                      </ComposerForm>
                    </Composer>
                  </div>
                </Thread>
              </TabsContent>
            </Tabs>

            <SearchDialogFooter className="justify-end flex">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Powered by{' '}
                <a
                  href="https://mixedbread.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <MxbaiLogoIcon className="size-4" />
                  <span className="text-logo">Mixedbread</span>
                </a>
              </p>
            </SearchDialogFooter>
          </div>
        </motion.div>
      </SearchDialogContent>
    </SearchDialog>
  );
}
