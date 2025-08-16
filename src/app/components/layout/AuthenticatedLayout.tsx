"use client"

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from '../../app/layout.module.css';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

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
            <a href="#" className={styles.active}>
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