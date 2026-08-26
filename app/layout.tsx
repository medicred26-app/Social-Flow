import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialFlow — Multi-Platform Social Media Scheduler',
  description: 'Schedule, compose, and analyze social media posts across Facebook, Instagram, YouTube, LinkedIn, and X.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased flex selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
        <ThemeProvider>
          <CustomCursor />
          {/* Main Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
