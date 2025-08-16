// src/app/components/MainLayout.tsx
"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import styles from '../layout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const authPages = ['/auth/signin', '/auth/signup', '/unauthorized'];
  const isAuthPage = authPages.includes(pathname);

  // Ako je auth stranica ili korisnik nije prijavljen, prikaži samo children
  if (isAuthPage || (!session && status !== "loading")) {
    return (
      <>
        {children}
      </>
    );
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Učitavanje...</div>
        </div>
      </div>
    );
  }

  // Puni layout za prijavljene korisnike
  return (
    <>
      <button onClick={toggleSidebar} className={styles.hamburgerButton}>
        ☰
      </button>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="iDnevnik Logo" />
          <span>iDnevnik</span>
        </div>
        <div className={styles.navLinks}>
          <span>Osnovna škola "Ime Škole"</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">
            <img src="/bell_icon.png" alt="Notifications" />
          </a>
          <div className={styles.userProfile}>
            <a href="#">
              <img src="/user_icon.png" alt="User Profile" />
            </a>
            <span className={styles.userProfileName}>
              {session?.user?.name || "Ime i prezime"}
            </span>
          </div>
          <a href="#">
            <img src="/question_icon.png" alt="Help" />
          </a>
          <a href="/pomoc-i-podrska">Pomoć i podrška</a>
          <a href="#">&rarr;</a>
          <button onClick={handleSignOut}>Odjavi se</button>
        </div>
      </header>
      <div className={styles.mainContainer}>
        <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Općenito</div>
            <a href="/dashboard" className={styles.active}>
              <img src="/homepage_icon.png" alt="Početna stranica" className={styles.sidebarIcon} />
              Početna stranica
            </a>
            <a href="/kalendar">
              <img src="/kalendar_icon.png" alt="Kalendar" className={styles.sidebarIcon} />
              Kalendar
            </a>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Nastava</div>
            <a href="#">
              <img src="/razrednistvo_icon.png" alt="Razredništvo" className={styles.sidebarIcon} />
              Razredništvo
            </a>
            <div className={styles.sidebarSection}>
              <a href="/odjeljenja/8-1">Odjeljenja 8-1</a>
              <a href="/odjeljenja/8-2">Odjeljenja 8-2</a>
              <a href="/odjeljenja/8-3">Odjeljenja 8-3</a>
            </div>
          </div>
        </nav>
        <main className={`${styles.content} ${isSidebarOpen ? styles.shifted : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
}