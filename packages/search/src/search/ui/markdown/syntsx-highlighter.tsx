'use client';

import ShikiHighlighter, { type ShikiHighlighterProps } from 'react-shiki';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export type HighlighterProps = Omit<ShikiHighlighterProps, 'theme'> & {
  theme?: ShikiHighlighterProps['theme'];
};

export function SyntaxHighlighter({ children, language, theme, className, ...props }: HighlighterProps) {
  const { theme: currentTheme } = useTheme();

  // Use provided theme or fallback to theme-aware defaults
  const shikiTheme = theme || (currentTheme === 'dark' ? 'github-dark' : 'github-light');

  return (
    <ShikiHighlighter
      {...props}
      language={language}
      theme={shikiTheme}
      className={cn('[&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:!p-4 [&_pre]:border', className)}
    >
      {children}
    </ShikiHighlighter>
  );
}

SyntaxHighlighter.displayName = 'SyntaxHighlighter';
