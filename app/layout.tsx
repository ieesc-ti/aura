import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aura Music CRM',
  description: 'Sistema de inteligência comercial, registro de música, emissão de ISRC, homologação no ECAD, split sheets de coautoria e controle de royalties.',
  openGraph: {
    title: 'Aura Music CRM',
    description: 'Sistema de inteligência comercial, registro de música, emissão de ISRC, homologação no ECAD, split sheets de coautoria e controle de royalties.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-w-[320px] overflow-x-hidden antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
