'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '../layout.module.css';
import { FaUserCircle, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session } = useSession();

  // ----- Stanje za roditelja -----
  const [children, setChildren] = useState([
    { id: 1, name: 'Petar Petrović', school: 'Osnovna škola "Ime Škole"' },
    { id: 2, name: 'Ana Anić', school: 'Druga osnovna škola "Ime Škole"' },
  ]);
  const [newChild, setNewChild] = useState({ name: '', school: '' });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChild.name && newChild.school) {
      setChildren([...children, { id: Date.now(), name: newChild.name, school: newChild.school }]);
      setNewChild({ name: '', school: '' });
    }
  };

  const handleDeleteChild = (id: number) => {
    setChildren(children.filter(child => child.id !== id));
  };

  // ----- Stanje za nastavnika -----
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Informatika' },
    { id: 2, name: 'Fizika' },
  ]);
  const [newSubject, setNewSubject] = useState('');
  const [classes, setClasses] = useState([
    { id: 1, name: 'Odjeljenje 8-1' },
    { id: 2, name: 'Odjeljenje 8-2' },
  ]);
  const [newClass, setNewClass] = useState('');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject) {
      setSubjects([...subjects, { id: Date.now(), name: newSubject }]);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClass) {
      setClasses([...classes, { id: Date.now(), name: newClass }]);
      setNewClass('');
    }
  };

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter(item => item.id !== id));
  };

  // ----- NOVO: Stanje i funkcije za promjenu lozinke -----
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordStatus(null);

    // 1. Provjera da li su polja prazna
    if (!newPassword || !confirmPassword) {
      setPasswordError('Sva polja moraju biti popunjena.');
      return;
    }

    // 2. Provjera podudarnosti lozinki
    if (newPassword !== confirmPassword) {
      setPasswordError('Lozinke se ne podudaraju.');
      return;
    }

    // 3. Upozorenje i potvrda
    const isConfirmed = window.confirm('Jeste li sigurni da želite promijeniti lozinku?');
    if (isConfirmed) {
      // Ovdje bi se inače slao zahtjev na server za promjenu lozinke
      console.log('Lozinka je uspješno promijenjena!');
      setPasswordStatus('success');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const renderContentByRole = () => {
    if (session?.user?.role === "RODITELJ") {
      return (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Moja djeca</h2>
          <form onSubmit={handleAddChild} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                placeholder="Ime i prezime djeteta" 
                value={newChild.name} 
                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })} 
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                placeholder="Škola" 
                value={newChild.school} 
                onChange={(e) => setNewChild({ ...newChild, school: e.target.value })} 
                required
              />
            </div>
            <button type="submit" className={styles.addButton}>
              <FaPlusCircle /> Dodaj dijete
            </button>
          </form>
          <div className={styles.listContainer}>
            {children.map(child => (
              <div key={child.id} className={styles.listItem}>
                <span>{child.name} - {child.school}</span>
                <button onClick={() => handleDeleteChild(child.id)} className={styles.deleteButton}>
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (session?.user?.role === "NASTAVNIK") {
      return (
        <>
          <div className={styles.profileSection}>
            <h2 className={styles.sectionTitle}>Moji predmeti</h2>
            <form onSubmit={handleAddSubject} className={styles.profileForm}>
              <div className={styles.formGroup}>
                <input 
                  type="text" 
                  placeholder="Naziv predmeta" 
                  value={newSubject} 
                  onChange={(e) => setNewSubject(e.target.value)} 
                  required
                />
              </div>
              <button type="submit" className={styles.addButton}>
                <FaPlusCircle /> Dodaj predmet
              </button>
            </form>
            <div className={styles.listContainer}>
              {subjects.map(subject => (
                <div key={subject.id} className={styles.listItem}>
                  <span>{subject.name}</span>
                  <button onClick={() => handleDeleteSubject(subject.id)} className={styles.deleteButton}>
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.profileSection}>
            <h2 className={styles.sectionTitle}>Moji razredi</h2>
            <form onSubmit={handleAddClass} className={styles.profileForm}>
              <div className={styles.formGroup}>
                <input 
                  type="text" 
                  placeholder="Naziv razreda" 
                  value={newClass} 
                  onChange={(e) => setNewClass(e.target.value)} 
                  required
                />
              </div>
              <button type="submit" className={styles.addButton}>
                <FaPlusCircle /> Dodaj razred
              </button>
            </form>
            <div className={styles.listContainer}>
              {classes.map(item => (
                <div key={item.id} className={styles.listItem}>
                  <span>{item.name}</span>
                  <button onClick={() => handleDeleteClass(item.id)} className={styles.deleteButton}>
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    // ... (sav postojeći kod iznad)
  
    if (session?.user?.role === "UCENIK") {
      // Mock podaci za učenika
      const studentInfo = {
        odjeljenje: '8-1',
        razrednik: 'Marko Marković',
        roditelj: 'Petar Petrović', // Dodajemo informaciju o roditelju
      };

      return (
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Osnovne informacije</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Odjeljenje:</span>
              <span className={styles.infoValue}>{studentInfo.odjeljenje}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Razrednik:</span>
              <span className={styles.infoValue}>{studentInfo.razrednik}</span>
            </div>
            {/* Prikazujemo informaciju o roditelju */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Roditelj:</span>
              <span className={styles.infoValue}>{studentInfo.roditelj}</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.mainInfoCard}>
        <FaUserCircle className={styles.profileIcon} />
        <div className={styles.userInfo}>
          <h1>{session?.user?.name || "Ime i prezime"}</h1>
          <p>Email: {session?.user?.email || "nepoznat"}</p>
          <p>Uloga: {session?.user?.role || "nepoznata"}</p>
        </div>
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Postavke profila</h2>
        {passwordStatus === 'success' ? (
          <div className={styles.successMessage}>
            <p>Lozinka je uspješno promijenjena!</p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">Nova lozinka:</label>
              <input 
                type="password" 
                id="newPassword"
                placeholder="Unesite novu lozinku"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Potvrda nove lozinke:</label>
              <input 
                type="password"
                id="confirmPassword"
                placeholder="Potvrdite novu lozinku"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
            <button type="submit" className={styles.submitButton}>Promijeni lozinku</button>
          </form>
        )}
      </div>

      {renderContentByRole()}
    </div>
  );
}