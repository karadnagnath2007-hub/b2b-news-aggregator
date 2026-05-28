import type { Metadata } from 'next';
import './globals.css';
import { Playfair_Display, Source_Serif_4 } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-header',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'B2B News Aggregator',
  description: 'Financial newspaper style B2B intelligence aggregator.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
