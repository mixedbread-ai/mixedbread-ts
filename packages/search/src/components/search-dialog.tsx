'use client';

import { useSearch } from '@/hooks/use-search';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from './search';
import { MxbaiLogoIcon } from './mxbai-logo-icon';

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
