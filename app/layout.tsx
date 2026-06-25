import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { RegisterSW } from '@/components/RegisterSW';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-app',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NotePlus — Budgeting',
  description: 'Pencatatan keuangan simpel ala catatan, sisa pos dihitung otomatis.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NotePlus',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={font.variable}>
      <body className="font-sans text-white antialiased">
        <StoreProvider>
          <div className="phone-frame text-white">{children}</div>
        </StoreProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
