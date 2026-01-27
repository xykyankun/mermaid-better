import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Neon App';
const appDescription =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A full-stack application powered by Neon, Next.js, and Drizzle ORM';

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}