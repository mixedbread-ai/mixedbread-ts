'use client';

import { ChevronRightIcon, FileTextIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { motion } from 'motion/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Result } from '../lib/types';

interface SearchContextProps {
  search: string;
  onSearchChange: (value: string) => void;
  results: Result[];
  isLoading: boolean;
  tag?: string;
  onTagChange?: (value: string | undefined) => void;
}

interface ListContextProps {
  active: string | null;
  setActive: (value: string | null) => void;
}

interface TagsListContextProps {
  allowClear: boolean;
}

const SearchContext = createContext<SearchContextProps | null>(null);

const ListContext = createContext<ListContextProps | null>(null);

const TagsListContext = createContext<TagsListContextProps | null>(null);

export interface SearchProps extends SearchContextProps {
  children: ReactNode;
}

export function Search({
  search,
  onSearchChange,
  results,
  isLoading = false,
  children,
  tag,
  onTagChange,
}: SearchProps) {
  const [active, setActive] = useState<string | null>(null);

  const memoizedValue = useMemo(
    () => ({
      search,
      onSearchChange,
      active,
      setActive,
      isLoading,
      results,
      tag,
      onTagChange,
    }),
    [search, onSearchChange, active, setActive, isLoading, results, tag, onTagChange],
  );

  return <SearchContext.Provider value={memoizedValue}>{children}</SearchContext.Provider>;
}

export function SearchInput({ className, ...props }: ComponentProps<'input'>) {
  const { search, onSearchChange } = useSearchRuntime();

  return (
    <input
      placeholder="Search"
      aria-label="Search"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      className={cn('w-0 flex-1 bg-transparent py-2 text-base placeholder:text-muted-foreground', className)}
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export function SearchList({
  items,
  Empty = () => <div className="py-12 text-center text-sm">No results found</div>,
  Item = (props) => <SearchListItem {...props} />,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollArea> & {
  items: Result[];
  /**
   * Renderer for empty list UI
   */
  Empty?: () => ReactNode;
  /**
   * Renderer for items
   */
  Item?: (props: { item: Result; onClick?: () => void }) => ReactNode;
}) {
  const [active, setActive] = useState<string | null>(items.at(0)?.id ?? null);
  const { tag: selectedTag } = useSearchRuntime();

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        let idx = items.findIndex((item) => item.id === active);
        if (idx === -1) idx = 0;
        else if (e.key === 'ArrowDown') idx++;
        else idx--;

        setActive(items.at(idx % items.length)?.id ?? null);
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        const selected = items.find((item) => item.id === active);

        if (selected) {
          // Trigger click on the active item element to respect any custom onClick
          const activeElement = document.querySelector(
            `[data-search-item-id="${selected.id}"]`,
          ) as HTMLButtonElement;
          if (activeElement) {
            activeElement.click();
          }
        }
        e.preventDefault();
      }
    },
    [items, active, setActive],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [onKey]);

  useEffect(() => {
    if (items.length > 0) setActive(items[0]?.id ?? null);
  }, [items]);

  const memoizedValue = useMemo(
    () => ({
      active,
      setActive,
    }),
    [active],
  );

  const filteredItems = selectedTag ? items.filter((item) => item.tag === selectedTag) : items;

  return (
    <SearchIf hasResults>
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
        <ScrollArea className={cn('flex flex-col p-4', className)} {...props}>
          <div className="flex flex-col gap-3">
            <ListContext.Provider value={memoizedValue}>
              <SearchIf isEmpty={true}>
                <Empty />
              </SearchIf>

              {children || filteredItems.map((item) => <Fragment key={item.id}>{Item({ item })}</Fragment>)}
            </ListContext.Provider>
          </div>
        </ScrollArea>
      </motion.div>
    </SearchIf>
  );
}

export function SearchListItem({
  item,
  className,
  onClick,
  ...props
}: ComponentProps<'button'> & {
  item: Result;
  onClick?: () => void;
}) {
  const { active: activeId, setActive } = useSearchList();
  const active = item.id === activeId;

  const handleClick =
    onClick ||
    (() => {
      window.location.href = item.url;
    });

  return (
    <button
      ref={useCallback(
        (element: HTMLButtonElement | null) => {
          if (active && element) {
            element.scrollIntoView({
              block: 'nearest',
            });
          }
        },
        [active],
      )}
      data-search-item-id={item.id}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex min-h-10 w-full flex-col justify-center border border-border/60 gap-2.5 px-4 py-2 rounded-lg text-sm',
        className,
        active && 'bg-accent/50 text-accent-foreground',
      )}
      onPointerMove={() => setActive(item.id)}
      onClick={handleClick}
      {...props}
    >
      <SearchListItemBreadcrumb breadcrumb={item.breadcrumb} />

      <div className="flex items-center gap-2">
        <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="line-clamp-1 text-left">{item.title}</span>
      </div>
    </button>
  );
}

export function SearchListItemBreadcrumb({ breadcrumb }: { breadcrumb: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {breadcrumb.map((breadcrumb, index) => (
        <Fragment key={breadcrumb}>
          <span className="text-xs text-muted-foreground">{breadcrumb}</span>
          {index !== breadcrumb.length - 1 && <ChevronRightIcon className="size-3 text-muted-foreground" />}
        </Fragment>
      ))}
    </div>
  );
}

type SearchIfFilters = {
  isLoading?: boolean;
  hasResults?: boolean;
  isEmpty?: boolean;
  hasQuery?: boolean;
  hasTag?: boolean;
  hasMultipleTags?: boolean;
  hasAvailableTags?: boolean;
};

type UseSearchIfProps = SearchIfFilters;

const useSearchIf = (props: UseSearchIfProps) => {
  const { search, results, isLoading, tag } = useSearchRuntime();

  if (props.isLoading !== undefined && props.isLoading !== isLoading) return false;

  if (props.hasResults === true && results.length === 0) return false;
  if (props.hasResults === false && results.length > 0) return false;

  if (props.isEmpty === true && (search.length === 0 || results.length > 0)) return false;
  if (props.isEmpty === false && results.length === 0) return false;

  if (props.hasQuery === true && search.length === 0) return false;
  if (props.hasQuery === false && search.length > 0) return false;

  if (props.hasTag === true && !tag) return false;
  if (props.hasTag === false && tag) return false;

  const availableTags = Array.from(new Set(results.map((result) => result.tag)));
  if (props.hasMultipleTags === true && availableTags.length <= 1) return false;
  if (props.hasMultipleTags === false && availableTags.length > 1) return false;

  if (props.hasAvailableTags === true && availableTags.length === 0) return false;
  if (props.hasAvailableTags === false && availableTags.length > 0) return false;

  return true;
};

export type SearchIfProps = PropsWithChildren<UseSearchIfProps>;

export function SearchIf({ children, ...query }: SearchIfProps) {
  const result = useSearchIf(query);
  return result ? children : null;
}

export function SearchIndicatorIcon({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('relative size-4', className)} {...props}>
      <SearchIf isLoading>
        <LoaderCircleIcon className="absolute size-full animate-spin text-primary transition-opacity" />
      </SearchIf>
      <SearchIf isLoading={false}>
        <SearchIcon className="absolute size-full text-muted-foreground transition-opacity" />
      </SearchIf>
    </div>
  );
}

export interface TagsListProps extends ComponentProps<'div'> {
  allowClear?: boolean;
}

const itemVariants = cva(
  'rounded-md border px-2 py-0.5 font-medium text-muted-foreground text-xs transition-colors',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
      },
    },
  },
);

export function TagsList({ allowClear = false, className, children, ...props }: TagsListProps) {
  const { results } = useSearchRuntime();
  const availableTags = Array.from(new Set(results.map((result) => result.tag)));

  return (
    <SearchIf hasAvailableTags>
      <div className={cn('flex flex-wrap items-center gap-1 px-4 py-3', className)} {...props}>
        <TagsListContext.Provider value={{ allowClear }}>
          {children ||
            availableTags.map((tag) => (
              <TagsListItem key={tag} value={tag}>
                {tag}
              </TagsListItem>
            ))}
        </TagsListContext.Provider>
      </div>
    </SearchIf>
  );
}

export function TagsListItem({
  value,
  className,
  ...props
}: ComponentProps<'button'> & {
  value: string;
}) {
  const { tag: selectedTag, onTagChange } = useSearchRuntime();
  const { allowClear } = useTagsList();
  const selected = value === selectedTag;

  return (
    <button
      type="button"
      data-active={selected}
      className={cn(itemVariants({ active: selected, className }))}
      onClick={() => {
        onTagChange?.(selected && allowClear ? undefined : value);
      }}
      tabIndex={-1}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function useSearchRuntime() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearchRuntime must be used within a Search');
  return ctx;
}

export function useTagsList() {
  const ctx = useContext(TagsListContext);
  if (!ctx) throw new Error('useTagsList must be used within a TagsList');
  return ctx;
}

export function useSearchList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('useSearchList must be used within a SearchDialogList');
  return ctx;
}
