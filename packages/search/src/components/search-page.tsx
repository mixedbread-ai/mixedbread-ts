'use client';

import { useSearch } from '@/search/hooks/use-search';
import { SearchList, SearchIndicatorIcon, TagsList, SearchInput, Search } from '@/search/ui/search';
import { useState } from 'react';
import { mockResults, mockTags } from '@/lib/utils';

export function CustomSearchPage() {
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
      <div className="flex items-center justify-between">
        <div className="relative w-full">
          <SearchIndicatorIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
          <SearchInput placeholder="Search..." className="w-full border rounded-md text-sm pl-10" />
        </div>
      </div>

      {mockedResults.length > 0 && (
        <div className="flex items-center justify-between">
          <TagsList allowClear={true} className="gap-2 px-0" />

          <span className="text-xs font-medium text-muted-foreground ml-auto bg-muted px-2 py-1 rounded-md">
            {mockedResults.length} Result{mockedResults.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <SearchList items={mockedResults} className="p-0" />
    </Search>
  );
}
