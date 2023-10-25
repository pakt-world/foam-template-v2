import './styles.css';
import 'pakt-ui/styles.css';

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/app/providers';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'Afrofund',
  description: '',
};

interface Props {
  children: React.ReactNode;
}

const circularStd = localFont({
  src: [
    {
      path: '../fonts/CircularStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CircularStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/CircularStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--circular-std-font',
});

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning className="h-screen">
      <head />
      <body className={`${circularStd.variable} font-sans min-h-screen antialiased`}>
        <Toaster position="top-right" gutter={8} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
