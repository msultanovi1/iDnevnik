// src/app/layout.tsx
'use client'; // This directive is needed for using client-side features like useState

import { useState } from 'react'; // Import the useState hook
import './globals.css';
import styles from './layout.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <button onClick={toggleSidebar} className={styles.hamburgerButton}>
          ☰ {/* Hamburger icon */}
        </button>

        <header className={styles.header}>
          {/* ... (Header content remains the same) ... */}
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
              <span className={styles.userProfileName}>Ime i prezime</span>
            </div>
            <a href="#">
              <img src="/question_icon.png" alt="Help" />
            </a>
            <a href="#">Pomoć i podrška</a>
            <a href="#">
              <img src="/arrow_icon.png" alt="Sign out" />
            </a>
            <button>Odjavi se</button>
          </div>
        </header>

        <div className={styles.mainContainer}>
          {/* Sidebar */}
          <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
            {/* ... (Sidebar content remains the same) ... */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Općenito</div>
              <a href="#" className={styles.active}>
                <img src="/homepage_icon.png" alt="Početna stranica" className={styles.sidebarIcon} />
                Početna stranica
              </a>
              <a href="#">
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
                <a href="#">Odjeljenja 8-1</a>
                <a href="#">Odjeljenja 8-2</a>
                <a href="#">Odjeljenja 8-3</a>
              </div>
            </div>
          </nav>

          {/* Main content area */}
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}