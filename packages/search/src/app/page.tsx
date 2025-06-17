import { SearchTrigger } from '@/components/search-trigger';

export default function Home() {
  return (
    <div className="container mx-auto flex gap-8 h-[80%] flex-1 flex-col items-center justify-center">
      <h1 className="text-center font-bold leading-tight tracking-tighter text-4xl md:text-5xl lg:text-6xl">
        Search Anything...
      </h1>

      <SearchTrigger />
    </div>
  );
}
