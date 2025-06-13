'use client';

import { useSearch } from '@/search/hooks/use-search';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchIndicatorIcon,
  SearchInput,
  SearchList,
  SearchDialogOverlay,
  Search,
  TagsList,
  TagsListItem,
} from '@/search/ui/search';
import { MxbaiLogoIcon } from './mxbai-logo-icon';
import { mockResults, mockTags } from '@/lib/utils';
import { useState } from 'react';

export function CustomSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(mockTags[0]);

  const mockedResults = mockResults(results);
  const filteredResults =
    selectedTag ? mockedResults.filter((result) => result.tag === selectedTag) : mockedResults;
  const availableTags = Array.from(new Set(mockedResults.map((result) => result.tag)));

  return (
    <Search search={search} onSearchChange={setSearch} isLoading={isLoading}>
      <SearchDialog {...props}>
        <SearchDialogOverlay />
        <SearchDialogContent>
          <SearchDialogHeader>
            <SearchIndicatorIcon />
            <SearchInput />
          </SearchDialogHeader>

          {availableTags.length > 0 && (
            <TagsList tag={selectedTag} onTagChange={setSelectedTag} allowClear={true}>
              {availableTags.map((tag) => (
                <TagsListItem key={tag} value={tag}>
                  {tag}
                </TagsListItem>
              ))}
            </TagsList>
          )}

          <SearchList items={filteredResults} />

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
