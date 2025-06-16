import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { ScrollArea } from '@/components/ui/scroll-area';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search powered by Mixedbread',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-svh flex-col">
            <SiteHeader />
            <main>
              <ScrollArea className="h-[calc(100svh-var(--spacing)*14-1px)] [&>div>div]:h-full px-4">
                {children}
              </ScrollArea>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
