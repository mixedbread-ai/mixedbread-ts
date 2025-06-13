'use client';

import { useSearch } from '@/search/hooks/use-search';
import { SearchIndicatorIcon, SearchInput, SearchList, Search, TagsList } from '@/search/ui/search';
import { MxbaiLogoIcon } from './mxbai-logo-icon';
import { mockResults, mockTags } from '@/lib/utils';
import { useState } from 'react';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogOverlay,
} from '@/search/ui/dialog';

export function CustomSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(mockTags[0]);

  const mockedResults = mockResults(results);

  return (
    <Search
      search={search}
      onSearchChange={setSearch}
      results={mockedResults}
      isLoading={isLoading}
      tag={selectedTag}
      onTagChange={setSelectedTag}
    >
      <SearchDialog {...props}>
        <SearchDialogOverlay />
        <SearchDialogContent>
          <SearchDialogHeader>
            <SearchIndicatorIcon />
            <SearchInput className="focus-visible:outline-none py-3" />
          </SearchDialogHeader>

          <TagsList allowClear={true} className="border-t border-border/60" />

          <SearchList items={mockedResults} className="border-t border-border/60" />

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
        </SearchDialogContent>
      </SearchDialog>
    </Search>
  );
}
