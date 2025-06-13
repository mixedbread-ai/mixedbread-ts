'use client';

import { useSearch } from '@/search/hooks/use-search';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from '@/search/ui/search';
import { MxbaiLogoIcon } from './mxbai-logo-icon';

export function CustomSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();
  const mockResults = results.map((result) => ({
    ...result,
    breadcrumb: ['App', 'Documentation', 'API Reference'],
  }));

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
        </SearchDialogHeader>

        <SearchDialogList items={mockResults} />

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
  );
}
