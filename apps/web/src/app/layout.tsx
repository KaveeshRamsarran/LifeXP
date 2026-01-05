import type { Metadata } from 'next';
import { Cinzel, Nunito } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Life XP',
  description: 'Gamify your life - Turn daily tasks into an RPG adventure',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${nunito.variable}`}>
      <body className={nunito.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
