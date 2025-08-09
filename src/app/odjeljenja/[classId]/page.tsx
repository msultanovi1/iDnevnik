// src/app/odjeljenja/[classId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './odjeljenje.module.css';

export default function ClassPage() {
  const params = useParams();
  const { classId } = params;

  // State to manage the active navigation tab
  const [activeTab, setActiveTab] = useState('Upis časa');

  const navItems = ['Upis časa', 'Prisustvo', 'Ocjene', 'Plan i program', 'Pismene zadaće'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Upis časa':
        return (
          <div className={styles.formSection}>
            <div className={styles.textAreaContainer}>
              <label htmlFor="nastavnaJedinica" className={styles.textAreaLabel}>Opis časa br. 44</label>
              <textarea id="nastavnaJedinica" className={styles.textArea} placeholder="Nastavna jedinica"></textarea>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="onlineCas" />
                <label htmlFor="onlineCas">Online čas</label>
              </div>
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.red}`}>Čas nije održan</button>
                <button className={`${styles.button} ${styles.green}`}>Spasi i unesi prisustvo</button>
              </div>
            </div>
          </div>
        );
      case 'Prisustvo':
        return <div>Prisustvo content...</div>;
      case 'Ocjene':
        return <div>Ocjene content...</div>;
      case 'Plan i program':
        return <div>Plan i program content...</div>;
      case 'Pismene zadaće':
        return <div>Pismene zadaće content...</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.classPage}>
      <h1 className={styles.classHeader}>Odjeljenje: {classId}</h1>
      <div className={styles.navBar}>
        {navItems.map(item => (
          <span
            key={item}
            className={`${styles.navItem} ${activeTab === item ? styles.active : ''}`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={styles.contentContainer}>
        {renderContent()}
      </div>
    </div>
  );
}