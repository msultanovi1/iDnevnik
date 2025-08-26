// src/app/razrednistvo/page.tsx
'use client';

import { useState } from 'react';
import styles from './razrednistvo.module.css';

interface Student {
  id: number;
  name: string;
  grades: number[];
  conduct: 'Primjereno' | 'Vrlo dobro' | 'Dobro' | 'Dovoljno' | 'Nedovoljno';
  opravdano: number;
  neopravdano: number;
}

const mockStudents: Student[] = [
  { id: 1, name: 'Anesa Imamović', grades: [5, 4, 5, 5], conduct: 'Primjereno', opravdano: 2, neopravdano: 0 },
  { id: 2, name: 'Tarik Softić', grades: [3, 4, 3, 5], conduct: 'Vrlo dobro', opravdano: 1, neopravdano: 1 },
  { id: 3, name: 'Amina Zukić', grades: [5, 5, 5, 5], conduct: 'Primjereno', opravdano: 0, neopravdano: 0 },
  { id: 4, name: 'Lejla Mehanović', grades: [3, 3, 4, 3], conduct: 'Dobro', opravdano: 3, neopravdano: 2 },
  { id: 5, name: 'Adnan Bektić', grades: [4, 4, 4, 4], conduct: 'Vrlo dobro', opravdano: 1, neopravdano: 0 },
];

export default function RazrednistvoPage() {
  const [activeTab, setActiveTab] = useState('Učenici');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateAverage = (grades: number[]): string => {
    if (grades.length === 0) return 'N/A';
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return (sum / grades.length).toFixed(2);
  };

  const renderTabContent = () => {
    if (activeTab === 'Učenici') {
      return (
        <div className={styles.content}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>Ime i prezime</th>
                <th>Opšti uspjeh</th>
                <th>Vladanje</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{calculateAverage(student.grades)}</td>
                  <td>{student.conduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className={styles.content}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>Ime i prezime</th>
                <th>Izostanci</th>
                <th>Opravdano</th>
                <th>Neopravdano</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.opravdano + student.neopravdano}</td>
                  <td>{student.opravdano}</td>
                  <td>{student.neopravdano}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.pageTitle}>Razredništvo: 8-1</div>
        <input
          type="text"
          placeholder="Pretraži učenike..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBar}
        />
      </div>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'Učenici' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Učenici')}
        >
          Učenici
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'Izostanci' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Izostanci')}
        >
          Izostanci
        </div>
      </div>
      {renderTabContent()}
    </div>
  );
}