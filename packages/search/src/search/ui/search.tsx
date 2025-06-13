'use client';

import { ChevronRightIcon, FileTextIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
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
} from 'react';
import { useMeasure } from '@/search/hooks/use-measure';
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
  Item?: (props: { item: Result; onClick: () => void }) => ReactNode;
}) {
  const [active, setActive] = useState<string | null>(items.at(0)?.id ?? null);
  const { search, tag: selectedTag } = useSearchRuntime();
  const router = useRouter();
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  const onOpen = useCallback(
    ({ url }: Result) => {
      router.push(url);
    },
    [router],
  );

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

        if (selected) onOpen(selected);
        e.preventDefault();
      }
    },
    [items, active, onOpen, setActive],
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

  if (items.length === 0) return null;

  return (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: bounds.height, opacity: 1 }}>
      <ScrollArea ref={ref} className={cn('flex max-h-[450px] flex-col p-4', className)} {...props}>
        <div className="flex flex-col gap-3">
          <ListContext.Provider value={memoizedValue}>
            {items.length === 0 && search.length > 0 && Empty()}

            {filteredItems.map((item) => (
              <Fragment key={item.id}>{Item({ item, onClick: () => onOpen(item) })}</Fragment>
            ))}
          </ListContext.Provider>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

export function SearchListItem({
  item,
  className,
  ...props
}: ComponentProps<'a'> & {
  item: Result;
}) {
  const { active: activeId, setActive } = useSearchList();
  const active = item.id === activeId;

  return (
    <a
      href={item.url}
      ref={useCallback(
        (element: HTMLAnchorElement | null) => {
          if (active && element) {
            element.scrollIntoView({
              block: 'nearest',
            });
          }
        },
        [active],
      )}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex min-h-10 w-full flex-col justify-center border border-border/60 gap-2.5 px-4 py-2 rounded-lg text-sm',
        className,
        active && 'bg-accent/50 text-accent-foreground',
      )}
      onPointerMove={() => setActive(item.id)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {item.breadcrumb.map((breadcrumb, index) => (
          <Fragment key={breadcrumb}>
            <span className="text-xs text-muted-foreground">{breadcrumb}</span>
            {index !== item.breadcrumb.length - 1 && (
              <ChevronRightIcon className="size-3 text-muted-foreground" />
            )}
          </Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <FileTextIcon className="size-4 text-muted-foreground" />
        <span className="flex-1 truncate">{item.title}</span>
      </div>
    </a>
  );
}

export function SearchIndicatorIcon({ className, ...props }: ComponentProps<'div'>) {
  const { isLoading } = useSearchRuntime();

  return (
    <div className={cn('relative size-4', className)} {...props}>
      <LoaderCircleIcon
        className={cn(
          'absolute size-full animate-spin text-primary transition-opacity',
          !isLoading && 'opacity-0',
        )}
      />
      <SearchIcon
        className={cn(
          'absolute size-full text-muted-foreground transition-opacity',
          isLoading && 'opacity-0',
        )}
      />
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

  if (availableTags.length === 0) return null;

  return (
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
