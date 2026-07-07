import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-y-auto border-none py-0 mb-2 text-sm">
      <table className={cn('w-full', className)} {...props} />
    </div>
  );
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('m-0 rounded-sm p-0 bg-background/40', className)} {...props} />;
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-none bg-accent', className)} {...props} />;
}

export function Th({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'border px-4 py-2 text-left [&>a]:font-semibold [&>a]:text-foreground [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  );
}
