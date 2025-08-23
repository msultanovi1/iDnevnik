// src/app/components/MainLayout.tsx
"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import styles from '../layout.module.css';

// Ikone koje koristimo
import { FaBars, FaHome, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaBookOpen } from 'react-icons/fa';
import { IoNotifications } from "react-icons/io5";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Dodajemo novu funkciju s potvrdom za odjavu
  const handleSignOutClick = () => {
    const isConfirmed = window.confirm("Želite se odjaviti?");
    if (isConfirmed) {
      signOut({ callbackUrl: '/auth/signin' });
    }
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
        <FaBars />
      </button>
      <header className={styles.header}>
        <a href="/dashboard">
          <div className={styles.logo}>
            <div className={styles.logoIconContainer}>
              <FaBookOpen className={styles.logoIcon} />
            </div>
            <span>iDnevnik</span>
          </div>
        </a>
        <div className={styles.navLinks}>
          <span>Osnovna škola "Ime Škole"</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">
            <IoNotifications className={styles.icon} />
          </a>
          <a href="/profil" className={styles.userProfile}>
            <FaUserCircle className={styles.icon} />
            <span className={styles.userProfileName}>
              {session?.user?.name || "Ime i prezime"}
            </span>
          </a>
          {/* Sada je cijela grupa jedan klikabilni link */}
          <a href="/pomoc-i-podrska" className={styles.helpGroup}>
            <FaQuestionCircle className={styles.icon} />
            <span>Pomoć i podrška</span>
          </a>
          {/* Gumb za odjavu sadrži i ikonu i tekst */}
          <button onClick={handleSignOutClick} className={styles.signOutGroup}>
            <FaSignOutAlt className={styles.icon} />
            <span>Odjavi se</span>
          </button>
        </div>
      </header>
      <div className={styles.mainContainer}>
        <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarSectionTitle}>Općenito</div>
            <a href="/dashboard" className={pathname === '/dashboard' ? styles.active : ''}>
              <FaHome className={styles.sidebarIcon} />
              Početna stranica
            </a>
            <a href="/kalendar" className={pathname === '/kalendar' ? styles.active : ''}>
              <FaCalendarAlt className={styles.sidebarIcon} />
              Kalendar
            </a>
          </div>
          
          <div className={styles.sidebarDivider}></div>

          {session?.user?.role === "NASTAVNIK" && (
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Nastava</div>
              <a href="#">
                <FaBookOpen className={styles.sidebarIcon} />
                Razredništvo
              </a>
              <div className={styles.sidebarSubSection}>
                <div className={styles.sidebarSectionTitle}>Odjeljenja</div>
                <a href="/odjeljenja/8-1">Odjeljenje 8-1</a>
                <a href="/odjeljenja/8-2">Odjeljenje 8-2</a>
                <a href="/odjeljenja/8-3">Odjeljenje 8-3</a>
              </div>
            </div>
          )}

          {session?.user?.role === "RODITELJ" && (
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Nastava</div>
              <a href="/roditelj/ocene">Ocjene djeteta</a>
              <a href="/roditelj/izostanci">Izostanci djeteta</a>
            </div>
          )}

          {session?.user?.role === "UCENIK" && (
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Nastava</div>
              <a href="/ucenik/ocene">Moje ocjene</a>
              <a href="/ucenik/raspored">Moj raspored</a>
            </div>
          )}

        </nav>
        <main className={`${styles.content} ${isSidebarOpen ? styles.shifted : ''}`}>
          {children}
        </main>
      </div>
    </>
  );
}