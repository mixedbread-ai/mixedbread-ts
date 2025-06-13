import { SearchTrigger } from '@/components/search-trigger';
import { SiteHeader } from '@/components/site-header';

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <SiteHeader />
      <main className="h-[calc(85svh-var(--spacing)*14)] mx-auto px-4">
        <div className="container flex max-w-screen-2xl gap-8 h-full flex-1 flex-col items-center justify-center">
          <h1 className="text-center font-bold leading-tight tracking-tighter text-4xl md:text-5xl lg:text-6xl">
            Search Anything...
          </h1>

          <SearchTrigger />
        </div>
      </main>
    </div>
  );
}
