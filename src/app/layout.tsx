// src/app/layout.tsx
import './globals.css';
import NextAuthSessionProvider from './components/providers/SessionProvider';
import MainLayout from './components/MainLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          <MainLayout>{children}</MainLayout>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}