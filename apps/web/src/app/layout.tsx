import type { Metadata } from 'next';
import { Cormorant_Garamond, Crimson_Text } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';

// Elden Ring inspired fonts - medieval gothic style
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-elden',
  display: 'swap',
});

const crimson = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
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
    <html lang="en" className={`${cormorant.variable} ${crimson.variable}`}>
      <body className={crimson.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
