// src/app/layout.tsx
import './globals.css';
import MainLayout from './components/MainLayout';
import { SessionProvider } from 'next-auth/react';
import { ChildProvider } from './context/ChildContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ChildProvider>
            <MainLayout>{children}</MainLayout>
          </ChildProvider>
        </SessionProvider>
      </body>
    </html>
  );
}