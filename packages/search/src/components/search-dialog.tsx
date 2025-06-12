'use client';

import { useSearch } from '@/hooks/use-search';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from './search';

export function CustomSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
        </SearchDialogHeader>

        <SearchDialogList items={results} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
