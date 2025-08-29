// src/app/razrednistvo/page.tsx
'use client';

import { useState, useMemo } from 'react';
import styles from './razrednistvo.module.css';
import { FaTimes } from 'react-icons/fa';

interface Student {
  id: number;
  name: string;
  grades: number[];
  conduct: 'Primjereno' | 'Vrlo dobro' | 'Dobro' | 'Dovoljno' | 'Nedovoljno';
  opravdano: number;
  neopravdano: number;
}

type Semester = 'Prvo polugodište' | 'Drugo polugodište';

// AŽURIRANI MOCK PODACI: Ocjene po predmetima i polugodištima
const mockGradesBySubject = {
  1: {
    'Prvo polugodište': {
      'Matematika': [5, 4, 5],
      'Fizika': [5],
      'Informatika': [5, 5],
      'Bosanski jezik': [4, 5],
    },
    'Drugo polugodište': {
      'Matematika': [5],
      'Fizika': [],
      'Informatika': [5],
      'Bosanski jezik': [5],
    },
  },
  2: {
    'Prvo polugodište': {
      'Matematika': [3],
      'Fizika': [3],
      'Informatika': [5],
      'Bosanski jezik': [4],
    },
    'Drugo polugodište': {
      'Matematika': [4],
      'Fizika': [5],
      'Informatika': [],
      'Bosanski jezik': [3],
    },
  },
  3: {
    'Prvo polugodište': {
      'Matematika': [5, 5],
      'Fizika': [5],
      'Informatika': [5, 5],
      'Bosanski jezik': [5],
    },
    'Drugo polugodište': {
      'Matematika': [5, 5],
      'Fizika': [5],
      'Informatika': [],
      'Bosanski jezik': [5],
    },
  },
  4: {
    'Prvo polugodište': {
      'Matematika': [3, 3, 4],
      'Fizika': [3],
      'Informatika': [4, 3],
      'Bosanski jezik': [3],
    },
    'Drugo polugodište': {
      'Matematika': [3],
      'Fizika': [],
      'Informatika': [],
      'Bosanski jezik': [3],
    },
  },
  5: {
    'Prvo polugodište': {
      'Matematika': [4, 4],
      'Fizika': [4],
      'Informatika': [4],
      'Bosanski jezik': [4],
    },
    'Drugo polugodište': {
      'Matematika': [4],
      'Fizika': [4],
      'Informatika': [4],
      'Bosanski jezik': [4],
    },
  },
};

const mockDetailedAbsences = {
  1: [
    { date: '12.03.2024.', class: 'Engleski jezik', status: 'Opravdano' },
    { date: '21.04.2024.', class: 'Fizika', status: 'Neopravdano' },
  ],
  2: [
    { date: '05.05.2024.', class: 'Informatika', status: 'Opravdano' },
    { date: '18.05.2024.', class: 'Fizika', status: 'Neopravdano' },
  ],
  3: [],
  4: [
    { date: '10.03.2024.', class: 'Hemija', status: 'Opravdano' },
    { date: '11.03.2024.', class: 'Matematika', status: 'Opravdano' },
    { date: '15.03.2024.', class: 'Bosanski jezik', status: 'Neopravdano' },
    { date: '22.03.2024.', class: 'Biologija', status: 'Opravdano' },
    { date: '22.03.2024.', class: 'Fizika', status: 'Neopravdano' },
  ],
  5: [
    { date: '01.04.2024.', class: 'Historija', status: 'Opravdano' },
  ],
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [semester, setSemester] = useState<Semester>('Prvo polugodište');

  const filteredStudents = useMemo(() => {
    return mockStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // NOVO: Funkcija za izračun prosjeka prema polugodištu
  const calculateAverageForSemester = useMemo(() => {
    return (studentId: number, semester: Semester) => {
      const studentGrades = mockGradesBySubject[studentId as keyof typeof mockGradesBySubject][semester];
      const allGrades: number[] = Object.values(studentGrades).flat();
      if (allGrades.length === 0) return 'N/A';
      const sum = allGrades.reduce((acc, grade) => acc + grade, 0);
      return (sum / allGrades.length).toFixed(2);
    };
  }, []);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
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
                <tr key={student.id} onClick={() => handleStudentClick(student)} className={styles.clickableRow}>
                  <td>{student.name}</td>
                  {/* NOVO: Prikaz prosjeka za odabrano polugodište */}
                  <td>{calculateAverageForSemester(student.id, semester)}</td>
                  <td>{student.conduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else { // Izostanci
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
                <tr key={student.id} onClick={() => handleStudentClick(student)} className={styles.clickableRow}>
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

  const renderModalContent = () => {
    if (!selectedStudent) return null;

    if (activeTab === 'Učenici') {
      const grades = mockGradesBySubject[selectedStudent.id as keyof typeof mockGradesBySubject][semester];
      return (
        <div className={styles.modalContent}>
          <button onClick={closeModal} className={styles.closeButton}>
            <FaTimes />
          </button>
          <h3 className={styles.modalTitle}>Ocjene za {selectedStudent.name}</h3>
          <div className={styles.semesterDropdownContainer}>
            <label htmlFor="semester-select">Polugodište:</label>
            <select
              id="semester-select"
              value={semester}
              onChange={(e) => setSemester(e.target.value as Semester)}
              className={styles.semesterSelect}
            >
              <option value="Prvo polugodište">Prvo polugodište</option>
              <option value="Drugo polugodište">Drugo polugodište</option>
            </select>
          </div>
          <div className={styles.gradeDetails}>
            {Object.keys(grades).map(subject => (
              <div key={subject} className={styles.subjectEntry}>
                <span className={styles.subjectName}>{subject}:</span>
                <span className={styles.subjectGrades}>
                  {grades[subject as keyof typeof grades].length > 0
                    ? grades[subject as keyof typeof grades].join(', ')
                    : 'Nema ocjena'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    } else { // Izostanci
      const absences = mockDetailedAbsences[selectedStudent.id as keyof typeof mockDetailedAbsences];
      return (
        <div className={styles.modalContent}>
          <button onClick={closeModal} className={styles.closeButton}>
            <FaTimes />
          </button>
          <h3 className={styles.modalTitle}>Detaljni izostanci za {selectedStudent.name}</h3>
          {absences.length > 0 ? (
            <ul className={styles.absenceList}>
              {absences.map((absence, index) => (
                <li key={index} className={styles.absenceItem}>
                  <div>
                    <span className={styles.absenceDate}>Datum: {absence.date}</span>
                    <span className={styles.absenceClass}>Čas: {absence.class}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${absence.status === 'Opravdano' ? styles.opravdano : styles.neopravdano}`}>
                    {absence.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Učenik nema zabilježenih izostanaka.</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.pageTitle}>Razredništvo: 8-1</div>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Pretraži učenike..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBar}
            />
          </div>
          <div className={styles.semesterContainer}>
            <label htmlFor="semester-filter" className={styles.semesterLabel}>Polugodište:</label>
            <select
              id="semester-filter"
              value={semester}
              onChange={(e) => setSemester(e.target.value as Semester)}
              className={styles.semesterSelect}
            >
              <option value="Prvo polugodište">Prvo polugodište</option>
              <option value="Drugo polugodište">Drugo polugodište</option>
            </select>
          </div>
        </div>
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

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}