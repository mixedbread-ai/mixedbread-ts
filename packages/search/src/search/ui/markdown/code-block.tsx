'use client';

import { ComponentProps, memo, ReactNode, isValidElement } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { SyntaxHighlighter } from './syntsx-highlighter';

interface CodeBlockProps extends ComponentProps<'pre'> {
  children?: ReactNode;
}

interface ReactElementProps {
  className?: string;
  children?: ReactNode;
}

const getCodeInfo = (children: ReactNode): { language: string; code: string } => {
  if (isValidElement(children) && children.props && typeof children.props === 'object') {
    const props = children.props as ReactElementProps;
    const className = props.className;
    const match = className?.match(/language-(\w+)/);
    const language = match ? match[1] : 'text';

    // Extract text content recursively
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (isValidElement(node) && node.props && typeof node.props === 'object') {
        const nodeProps = node.props as ReactElementProps;
        if (nodeProps.children) {
          return extractText(nodeProps.children);
        }
      }
      return '';
    };

    const code = extractText(props.children || '').replace(/\n$/, '');
    return { language, code };
  }

  // Fallback: treat the entire children as plain text
  return {
    language: 'text',
    code: typeof children === 'string' ? children : '',
  };
};

function CodeBlockComponent({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const { language, code } = getCodeInfo(children);

  // If no code content, render as regular pre
  if (!code.trim()) {
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-3">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-md size-8 border border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:border-border/60 backdrop-blur-sm transition-all"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ?
            <CheckIcon className="size-4" />
          : <CopyIcon className="size-4" />}
          <span className="sr-only">{copied ? 'Copied' : 'Copy code'}</span>
        </button>
      </div>

      <SyntaxHighlighter language={language} showLanguage={false}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export const CodeBlock = memo(CodeBlockComponent);
