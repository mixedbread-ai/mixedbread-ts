'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
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

interface SearchDialogContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}

interface ListContextProps {
  active: string | null;
  setActive: (value: string | null) => void;
}

interface TagsListContextProps {
  value?: string;
  onValueChange: (value: string | undefined) => void;
  allowClear: boolean;
}

const Context = createContext<SearchDialogContextProps | null>(null);

const ListContext = createContext<ListContextProps | null>(null);

const TagsListContext = createContext<TagsListContextProps | null>(null);

export interface SearchDialogProps extends SearchDialogContextProps {
  children: ReactNode;
}

export function SearchDialog({
  open,
  onOpenChange,
  search,
  onSearchChange,
  isLoading = false,
  children,
}: SearchDialogProps) {
  const [active, setActive] = useState<string | null>(null);

  const memoizedValue = useMemo(
    () => ({
      open,
      onOpenChange,
      search,
      onSearchChange,
      active,
      setActive,
      isLoading,
    }),
    [open, onOpenChange, search, onSearchChange, active, setActive, isLoading],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <Context.Provider value={memoizedValue}>{children}</Context.Provider>
    </DialogPrimitive.Root>
  );
}

export function SearchDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-2 px-4', className)} {...props} />;
}

export function SearchDialogInput({ className, ...props }: ComponentProps<'input'>) {
  const { search, onSearchChange } = useSearchDialog();

  return (
    <input
      placeholder="Search"
      aria-label="Search"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      className={cn(
        'w-0 flex-1 bg-transparent py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none',
        className,
      )}
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export function SearchDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mt-auto border-t border-border/60 p-4', className)} {...props} />;
}

export function SearchDialogOverlay(props: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      {...props}
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in supports-[backdrop-filter]:bg-black/20',
        props.className,
      )}
    />
  );
}

export function SearchDialogContent({
  children,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Content
      className={cn(
        '-translate-x-1/2 fixed top-[10vh] left-1/2 z-50 w-[98vw] max-w-screen-sm rounded-lg border bg-popover shadow-lg',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      aria-describedby={undefined}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  );
}

export function SearchDialogList({
  items,
  Empty = () => <div className="py-12 text-center text-sm">No results found</div>,
  Item = (props) => <SearchDialogListItem {...props} />,
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
  const { onOpenChange, search } = useSearchDialog();
  const router = useRouter();
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  const onOpen = useCallback(
    ({ url }: Result) => {
      router.push(url);
      onOpenChange(false);
    },
    [router, onOpenChange],
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

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: bounds.height, opacity: 1 }}
      className="border-t border-border/60"
    >
      <ScrollArea ref={ref} className={cn('flex max-h-[450px] flex-col p-4', props.className)} {...props}>
        <div className="flex flex-col gap-3">
          <ListContext.Provider value={memoizedValue}>
            {items.length === 0 && search.length > 0 && Empty()}

            {items.map((item) => (
              <Fragment key={item.id}>{Item({ item, onClick: () => onOpen(item) })}</Fragment>
            ))}
          </ListContext.Provider>
        </div>
      </ScrollArea>
    </motion.div>
  );
}

export function SearchDialogListItem({
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
        'flex min-h-10 w-full flex-col justify-center select-none border border-border/60 gap-2.5 px-4 py-2 rounded-lg text-start text-sm',
        active && 'bg-accent/50 text-accent-foreground',
        className,
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

export function SearchDialogIcon({ className, ...props }: ComponentProps<'div'>) {
  const { isLoading } = useSearchDialog();

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
  tag?: string;
  onTagChange: (tag: string | undefined) => void;
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

export function TagsList({ tag, onTagChange, allowClear = false, className, ...props }: TagsListProps) {
  const memoizedValue = useMemo(
    () => ({
      value: tag,
      onValueChange: onTagChange,
      allowClear,
    }),
    [tag, onTagChange, allowClear],
  );

  return (
    <div
      className={cn('flex flex-wrap items-center border-t border-border/60 gap-1 p-3', className)}
      {...props}
    >
      <TagsListContext.Provider value={memoizedValue}>{props.children}</TagsListContext.Provider>
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
  const { onValueChange, value: selectedValue, allowClear } = useTagsList();
  const selected = value === selectedValue;

  return (
    <button
      type="button"
      data-active={selected}
      className={cn(itemVariants({ active: selected, className }))}
      onClick={() => {
        onValueChange(selected && allowClear ? undefined : value);
      }}
      tabIndex={-1}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function useSearchDialog() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useSearchDialog must be used within a SearchDialog');
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
