import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bahir Dar Tourism Experience | Where Lake Tana meets the Blue Nile',
  description:
    'Discover Bahir Dar, Ethiopia. Explore ancient island monasteries, Blue Nile Falls, create customized 3-day itineraries, and book experiences.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
