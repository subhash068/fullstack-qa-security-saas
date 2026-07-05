import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SecLab QA - Security Testing Training Platform',
  description: 'An intentionally vulnerable web application strictly for local defensive security testing and QA education.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col relative z-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
