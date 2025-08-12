// src/app/odjeljenja/[classId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './odjeljenje.module.css';

interface Grade {
  value: number;
  date: string;
}

interface Student {
  id: number;
  name: string;
  lastName: string;
  classId: string;
  grades: Grade[];
}

const initialStudents: Student[] = [
  { id: 1, name: 'Amar', lastName: 'Hadžić', classId: '8-1', grades: [{ value: 4, date: '2025-08-01' }] },
  { id: 2, name: 'Emina', lastName: 'Kovačević', classId: '8-1', grades: [{ value: 5, date: '2025-08-02' }, { value: 3, date: '2025-08-03' }] },
  { id: 3, name: 'Selma', lastName: 'Ibrahimović', classId: '8-1', grades: [] },
  { id: 4, name: 'Dženan', lastName: 'Husić', classId: '8-1', grades: [{ value: 2, date: '2025-08-04' }] },
  { id: 5, name: 'Ibrahim', lastName: 'Alić', classId: '8-2', grades: [] },
  { id: 6, name: 'Jasmina', lastName: 'Babić', classId: '8-2', grades: [{ value: 5, date: '2025-08-05' }] },
  { id: 7, name: 'Faris', lastName: 'Čović', classId: '8-3', grades: [] },
  { id: 8, name: 'Lejla', lastName: 'Delić', classId: '8-3', grades: [{ value: 4, date: '2025-08-06' }] },
  { id: 9, name: 'Adnan', lastName: 'Mujkić', classId: '8-1', grades: [{ value: 3, date: '2025-08-07' }] },
  { id: 10, name: 'Ismar', lastName: 'Smajlović', classId: '8-1', grades: [{ value: 5, date: '2025-08-08' }, { value: 5, date: '2025-08-09' }] },
];

export default function ClassPage() {
  const params = useParams();
  const { classId } = params;

  const [activeTab, setActiveTab] = useState('Ocjene');
  const [students, setStudents] = useState(initialStudents);
  const [isFinalizingGrades, setIsFinalizingGrades] = useState(false);

  // States for the Prisustvo section
  const [absentStudents, setAbsentStudents] = useState(() => {
    return students.filter(student => student.classId === classId && (student.id === 1 || student.id === 2));
  });

  const [availableStudents, setAvailableStudents] = useState(() => {
    return students.filter(student => student.classId === classId && !absentStudents.some(absent => absent.id === student.id));
  });

  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');

  // States for the Ocjene section
  const [gradeSearchTerm, setGradeSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [newGrade, setNewGrade] = useState<number | ''>('');
  const [gradeDate, setGradeDate] = useState('');

  const navItems = ['Upis časa', 'Prisustvo', 'Ocjene', 'Plan i program', 'Pismene zadaće'];

  // Functions for Prisustvo
  const removeStudent = (studentId: number) => {
    const studentToRemove = absentStudents.find(student => student.id === studentId);
    if (studentToRemove) {
      setAbsentStudents(prev => prev.filter(student => student.id !== studentId));
      setAvailableStudents(prev => [...prev, studentToRemove].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const addStudent = (studentId: number) => {
    const studentToAdd = availableStudents.find(student => student.id === studentId);
    if (studentToAdd) {
      setAvailableStudents(prev => prev.filter(student => student.id !== studentId));
      setAbsentStudents(prev => [...prev, studentToAdd].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const filteredAvailableStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(attendanceSearchTerm.toLowerCase())
  );
  
  // Functions for Ocjene
  const handleAddGrade = () => {
    if (selectedStudentId && newGrade && gradeDate) {
      const today = new Date().toISOString().split('T')[0];
      if (gradeDate > today) {
        alert('Datum ne može biti u budućnosti.');
        return;
      }
      
      const grade = { value: newGrade as number, date: gradeDate };
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === selectedStudentId
            ? { ...student, grades: [...student.grades, grade] }
            : student
        )
      );

      setSelectedStudentId(null);
      setNewGrade('');
      setGradeDate('');
      setGradeSearchTerm('');
    }
  };

  const studentsInClass = students.filter(student => student.classId === classId);

  const filteredStudentsForGrades = studentsInClass
    .filter(student => 
      !absentStudents.some(absentStudent => absentStudent.id === student.id)
    )
    .filter(student =>
      student.name.toLowerCase().includes(gradeSearchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(gradeSearchTerm.toLowerCase())
    );
  
  const studentsWithLeastGrades = studentsInClass
    .sort((a, b) => a.grades.length - b.grades.length);

  // GPA and Final Grade calculation
  const getGPA = (grades: Grade[]): number => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.value, 0);
    return sum / grades.length;
  };

  const getFinalGrade = (gpa: number): number | string => {
    if (gpa === 0) return '-';
    if (gpa > 4.5) return 5;
    if (gpa > 3.5) return 4;
    if (gpa > 2.5) return 3;
    if (gpa > 1.5) return 2;
    return 1;
  };
  
  const renderFinalGrades = () => {
    const studentsWithGPA = studentsInClass.map(student => {
      const gpa = getGPA(student.grades);
      const finalGrade = getFinalGrade(gpa);
      return { ...student, gpa, finalGrade };
    });

    return (
      <div>
        <h2 className={styles.sectionTitle}>Zaključivanje ocjena</h2>
        <table className={styles.studentsList}>
          <thead>
            <tr>
              <th>Ime</th>
              <th>Prezime</th>
              <th style={{ textAlign: 'center' }}>Ocjene</th>
              <th style={{ textAlign: 'center' }}>Prosjek ocjena</th>
              <th style={{ textAlign: 'center' }}>Zaključna ocjena</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithGPA.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.lastName}</td>
                <td style={{ textAlign: 'center' }}>
                  {student.grades.map(g => g.value).join(', ')}
                </td>
                <td style={{ textAlign: 'center' }}>{student.gpa.toFixed(2)}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{student.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.finalGradesFooter}>
          <button className={`${styles.nextButton} ${styles.gray}`} onClick={() => setIsFinalizingGrades(false)}>
            Vrati se na upis ocjene
          </button>
          <button className={styles.nextButton}>
            Spasi i pređi na ocjene
          </button>
        </div>
      </div>
    );
  };
  
  const renderOcjeneTab = () => {
    return (
      <div>
        <h2 className={styles.sectionTitle}>Upiši ocjenu</h2>
        <div className={styles.gradesHeader}>
          <select
            className={styles.searchInput}
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
          >
            <option value="">Pretražite učenike</option>
            {filteredStudentsForGrades.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} {student.lastName}
              </option>
            ))}
          </select>
          <input
            type="date"
            className={styles.searchInput}
            value={gradeDate}
            onChange={(e) => setGradeDate(e.target.value)}
          />
          <select
            className={styles.searchInput}
            value={newGrade}
            onChange={(e) => setNewGrade(Number(e.target.value))}
          >
            <option value="">Ocjena</option>
            {[1, 2, 3, 4, 5].map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <button onClick={handleAddGrade} className={styles.gradeActionButton}>
            Upiši ocjenu
          </button>
        </div>

        <h3 className={styles.gradesTable}>Učenici sa najmanje ocjena:</h3>
        <table className={styles.studentsList}>
          <thead>
            <tr>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Broj ocjena</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithLeastGrades.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.lastName}</td>
                <td>{student.grades.length}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.gradesFooter}>
          <button className={`${styles.nextButton} ${styles.gray}`} onClick={() => setIsFinalizingGrades(true)}>
            Pređi na zaključivanje ocjena
          </button>
          <button className={styles.nextButton}>
            Pređi na plan i program
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isFinalizingGrades) {
      return renderFinalGrades();
    }
    
    switch (activeTab) {
      case 'Upis časa':
        // ... (existing code for Upis časa) ...
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
        // ... (existing code for Prisustvo) ...
        return (
          <div>
            <div className={styles.searchContainer}>
              <label htmlFor="studentSearch">Unesite odsustne:</label>
              <input
                id="studentSearch"
                className={styles.searchInput}
                type="text"
                placeholder="Pretraga"
                value={attendanceSearchTerm}
                onChange={(e) => setAttendanceSearchTerm(e.target.value)}
              />
            </div>
            
            <h3>Dostupni učenici:</h3>
            <table className={styles.studentsList}>
              <tbody>
                {filteredAvailableStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name} {student.lastName}</td>
                    <td>
                      <button className={styles.addButton} onClick={() => addStudent(student.id)}>Dodaj</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Evidentirani odsustni učenici:</h3>
            <table className={styles.studentsList}>
              <thead>
                <tr>
                  <th>Ime</th>
                  <th>Prezime</th>
                  <th>Ukloni učenika sa spiska</th>
                </tr>
              </thead>
              <tbody>
                {absentStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.lastName}</td>
                    <td>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeStudent(student.id)}
                      >
                        Ukloni učenika
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.attendanceFooter}>
              <button className={styles.nextButton}>Spasi i predi na ocjene</button>
            </div>
          </div>
        );
      case 'Ocjene':
        return renderOcjeneTab();
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
            onClick={() => {
              setActiveTab(item);
              setIsFinalizingGrades(false); // Reset the final grades view when a tab is clicked
            }}
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