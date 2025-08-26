// src/app/components/MainLayout.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import styles from '../layout.module.css';
import { ChildProvider, useChild } from '../context/ChildContext';

// Uvozimo ikone
import { FaBars, FaHome, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaBookOpen } from 'react-icons/fa';
import { IoNotifications } from "react-icons/io5";

// Mock podaci za nastavnika i učenika
const teacherSchool = 'Druga Gimnazija Sarajevo';
const studentSchool = 'Srednja elektrotehnička škola';

const MainLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { selectedChild, setSelectedChild } = useChild();

  const parentChildren = [
    { id: 'child1', name: 'Petar Petrović', school: 'Prva osnovna škola' },
    { id: 'child2', name: 'Ana Anić', school: 'Druga osnovna škola' },
  ];
  
  const [currentSchoolName, setCurrentSchoolName] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOutClick = () => {
    const isConfirmed = window.confirm("Želite li se sigurno odjaviti?");
    if (isConfirmed) {
      localStorage.removeItem('selectedChild');
      setSelectedChild(null);
      signOut({ callbackUrl: '/auth/signin' });
    }
  };

  const handleChildSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const childId = e.target.value;
    const child = parentChildren.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      localStorage.setItem('selectedChild', JSON.stringify(child));
    } else {
      setSelectedChild(null);
      localStorage.removeItem('selectedChild');
    }
  };

  useEffect(() => {
    if (session?.user?.role === "RODITELJ") {
      setCurrentSchoolName(selectedChild?.school || '');
    } else if (session?.user?.role === "NASTAVNIK") {
      setCurrentSchoolName(teacherSchool);
    } else if (session?.user?.role === "UCENIK") {
      setCurrentSchoolName(studentSchool);
    } else {
      setCurrentSchoolName('');
    }
  }, [selectedChild, session?.user?.role]);

  const authPages = ['/auth/signin', '/auth/signup', '/unauthorized'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage || (!session && status !== "loading")) {
    return (
      <>
        {children}
      </>
    );
  }

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
          <span>{currentSchoolName}</span>
        </div>
        <div className={styles.navLinks}>
          <a href="/notifications">
            <IoNotifications className={styles.icon} />
          </a>
          <a href="/profil" className={styles.userProfile}>
            <FaUserCircle className={styles.icon} />
            <span className={styles.userProfileName}>
              {session?.user?.name || "Ime i prezime"}
            </span>
          </a>
          <a href="/pomoc-i-podrska" className={styles.helpGroup}>
            <FaQuestionCircle className={styles.icon} />
            <span>Pomoć i podrška</span>
          </a>
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
              <a href="/razrednistvo" className={pathname === '/razrednistvo' ? styles.active : ''}>
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
              <div className={styles.sidebarSectionTitle}>Moja djeca</div>
              <div className={styles.childSelectContainer}>
                  <select
                    className={styles.childSelect}
                    value={selectedChild?.id || ''}
                    onChange={handleChildSelect}
                  >
                    <option value="">Odaberite dijete</option>
                    {parentChildren.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
              </div>
              <div className={styles.sidebarSubSection}>
                <div className={styles.sidebarSectionTitle}>Nastava</div>
                <a href="/roditelj/ocene">Ocjene djeteta</a>
                <a href="/roditelj/izostanci">Izostanci djeteta</a>
              </div>
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
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChildProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ChildProvider>
  );
}