'use client';

import { useSearch } from '@/search/hooks/use-search';
import {
  SearchList,
  SearchIndicatorIcon,
  TagsList,
  TagsListItem,
  SearchInput,
  Search,
} from '@/search/ui/search';
import { useState } from 'react';
import { mockResults, mockTags } from '@/lib/utils';

export function CustomSearchPage() {
  const { search, setSearch, results, isLoading } = useSearch();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(mockTags[0]);

  const mockedResults = mockResults(results);
  const filteredResults =
    selectedTag ? mockedResults.filter((result) => result.tag === selectedTag) : mockedResults;
  const availableTags = Array.from(new Set(mockedResults.map((result) => result.tag)));

  return (
    <Search search={search} onSearchChange={setSearch} isLoading={isLoading}>
      <div className="flex items-center justify-between">
        <div className="relative w-full">
          <SearchIndicatorIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
          <SearchInput placeholder="Search..." className="w-full border rounded-md py-2 text-sm pl-10" />
        </div>
      </div>

      {mockedResults.length > 0 && (
        <div className="flex items-center justify-between">
          {availableTags.length > 0 && (
            <TagsList
              tag={selectedTag}
              onTagChange={setSelectedTag}
              allowClear={true}
              className="border-t-0 gap-2 px-0"
            >
              {availableTags.map((tag) => (
                <TagsListItem key={tag} value={tag}>
                  {tag}
                </TagsListItem>
              ))}
            </TagsList>
          )}

          <span className="text-xs font-medium text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-md">
            {mockedResults.length} Result{mockedResults.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <SearchList items={filteredResults} className="p-0 border-t-0" />
    </Search>
  );
}
