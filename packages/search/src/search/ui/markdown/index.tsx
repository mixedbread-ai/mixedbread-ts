import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Table, Td, Th, THead, Tr } from './table';
import { CodeBlock } from './code-block';
import { ComponentProps, memo } from 'react';

type MarkdownProps = ComponentProps<typeof ReactMarkdown>;

function MarkdownComponent({ children, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h4>,
        h5: ({ children }) => <h5 className="text-sm font-semibold mb-2 mt-3 first:mt-0">{children}</h5>,
        h6: ({ children }) => <h6 className="text-xs font-semibold mb-2 mt-3 first:mt-0">{children}</h6>,
        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
        code: ({ children }) => {
          return (
            <code className="relative rounded-md border border-border bg-accent px-1.5 py-0.5 font-medium font-mono text-foreground text-sm">
              {children}
            </code>
          );
        },
        pre: ({ children, ...props }) => {
          return <CodeBlock {...props}>{children}</CodeBlock>;
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-muted-foreground pl-4 italic mb-3">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline text-primary decoration-1 decoration-primary underline-offset-4 hover:decoration-2"
          >
            {children}
          </a>
        ),
        hr: () => <hr className="my-4 border-muted" />,
        table: Table,
        thead: THead,
        tr: Tr,
        th: Th,
        td: Td,
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}

export const Markdown = memo(MarkdownComponent);
