'use client';

import Link from 'next/link';
import { MxbaiLogoIcon } from './mxbai-logo-icon';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50">
      <div className="container mx-auto px-4 flex h-14 justify-between items-center">
        <Link className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
          <MxbaiLogoIcon className="h-6 w-6" />
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
