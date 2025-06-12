'use client';

import { SearchTrigger } from '@/components/search-trigger';

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <SearchTrigger />
      </div>
    </main>
  );
}
