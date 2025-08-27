// src/app/components/MainLayout.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '../layout.module.css';
import { ChildProvider, useChild } from '../context/ChildContext';

// Uvozimo ikone
import { FaBars, FaHome, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaBookOpen, FaChild, FaStar, FaCalendarTimes } from 'react-icons/fa';
import { IoNotifications } from "react-icons/io5";

// Mock podaci za nastavnika i učenika
const teacherSchool = 'Druga Gimnazija Sarajevo';
const studentSchool = 'Srednja elektrotehnička škola';

const MainLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('isSidebarOpen');
      return storedState ? JSON.parse(storedState) : true;
    }
    return true;
  });
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { selectedChild, setSelectedChild } = useChild();

  const parentChildren = useMemo(() => ([
    { id: 'child1', name: 'Petar Petrović', school: 'Prva osnovna škola' },
    { id: 'child2', name: 'Ana Anić', school: 'Druga osnovna škola' },
  ]), []);
  
  const [currentSchoolName, setCurrentSchoolName] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState: boolean) => {
      const newState = !prevState;
      localStorage.setItem('isSidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const handleSignOutClick = () => {
    const isConfirmed = window.confirm("Želite li se sigurno odjaviti?");
    if (isConfirmed) {
      localStorage.removeItem('selectedChild');
      localStorage.removeItem('isSidebarOpen');
      setSelectedChild(null);
      signOut({ callbackUrl: '/auth/signin' });
    }
  };

  const handleChildSelect = (child: { id: string, name: string, school: string }) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('dijete', child.id);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (session?.user?.role === "RODITELJ") {
      const childIdFromUrl = searchParams.get('dijete');
      
      const childToSelect = childIdFromUrl 
          ? parentChildren.find(c => c.id === childIdFromUrl) 
          : null;
      
      if (childToSelect !== selectedChild) {
        setSelectedChild(childToSelect || null);
      }
      
      if (childToSelect) {
        setCurrentSchoolName(childToSelect.school);
      } else {
        setCurrentSchoolName('');
      }
    } else if (session?.user?.role === "NASTAVNIK") {
      setCurrentSchoolName(teacherSchool);
    } else if (session?.user?.role === "UCENIK") {
      setCurrentSchoolName(studentSchool);
    } else {
      setCurrentSchoolName('');
    }
  }, [session?.user?.role, searchParams, parentChildren, setSelectedChild, selectedChild]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "RODITELJ" && pathname === '/dashboard' && !searchParams.get('dijete')) {
      const defaultChild = parentChildren[0];
      if (defaultChild) {
        router.replace(`${pathname}?dijete=${defaultChild.id}`);
      }
    }
  }, [status, session, parentChildren, searchParams, router, pathname]);

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
      <header className={styles.header}>
        <button onClick={toggleSidebar} className={styles.hamburgerButton}>
          <FaBars />
        </button>
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
          <a href="/obavijesti">
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
              <div className={styles.sidebarSubSection}>
                {parentChildren.map(child => (
                    <a
                      key={child.id}
                      href={`/ocjene?dijete=${child.id}`}
                      className={`${styles.childItem} ${selectedChild?.id === child.id ? styles.active : ''}`}
                      onClick={(e) => {
                          e.preventDefault();
                          handleChildSelect(child);
                      }}
                    >
                      <FaChild className={styles.sidebarIcon} />
                      {child.name}
                    </a>
                ))}
              </div>

              {selectedChild && (
                <>
                    <div className={styles.sidebarSubSection}>
                        <div className={styles.sidebarSectionTitle}>Nastava</div>
                        <a
                            href={`/ocjene?dijete=${selectedChild.id}`}
                            className={pathname.startsWith('/ocjene') ? styles.active : ''}
                        >
                            <FaStar className={styles.sidebarIcon} />
                            Ocjene djeteta
                        </a>
                        <a
                            href={`/izostanci?dijete=${selectedChild.id}`}
                            className={pathname.startsWith('/izostanci') ? styles.active : ''}
                        >
                            <FaCalendarTimes className={styles.sidebarIcon} />
                            Izostanci djeteta
                        </a>
                    </div>
                </>
              )}

            </div>
          )}

          {session?.user?.role === "UCENIK" && (
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarSectionTitle}>Nastava</div>
              <a href="/ucenik/ocene" className={pathname === '/ucenik/ocene' ? styles.active : ''}>
                <FaStar className={styles.sidebarIcon} />
                Moje ocjene
              </a>
              <a href="/ucenik/raspored" className={pathname === '/ucenik/raspored' ? styles.active : ''}>
                <FaCalendarAlt className={styles.sidebarIcon} />
                Moj raspored
              </a>
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