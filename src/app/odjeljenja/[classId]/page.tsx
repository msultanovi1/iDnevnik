// src/app/odjeljenja/[classId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './odjeljenje.module.css';
import { FaTrash, FaTimes } from 'react-icons/fa';

interface Grade {
  value: number;
  date: string;
  type: string;
}

interface Student {
  id: number;
  name: string;
  lastName: string;
  classId: string;
  grades: Grade[];
}

interface WrittenAssignment {
  id: number;
  title: string;
  date: string;
}

interface LessonPlanItem {
  id: number;
  topic: string;
  unit: string;
}

const initialStudents: Student[] = [
  { id: 1, name: 'Amar', lastName: 'Hadžić', classId: '8-1', grades: [{ value: 4, date: '2025-08-01', type: 'Usmeni' }] },
  { id: 2, name: 'Emina', lastName: 'Kovačević', classId: '8-1', grades: [{ value: 5, date: '2025-08-02', type: 'Kontrolni' }, { value: 3, date: '2025-08-03', type: 'Usmeni' }] },
  { id: 3, name: 'Selma', lastName: 'Ibrahimović', classId: '8-1', grades: [] },
  { id: 4, name: 'Dženan', lastName: 'Husić', classId: '8-1', grades: [{ value: 2, date: '2025-08-04', type: 'Usmeni' }] },
  { id: 5, name: 'Ibrahim', lastName: 'Alić', classId: '8-2', grades: [] },
  { id: 6, name: 'Jasmina', lastName: 'Babić', classId: '8-2', grades: [{ value: 5, date: '2025-08-05', type: 'Usmeni' }] },
  { id: 7, name: 'Faris', lastName: 'Čović', classId: '8-3', grades: [] },
  { id: 8, name: 'Lejla', lastName: 'Delić', classId: '8-3', grades: [{ value: 4, date: '2025-08-06', type: 'Aktivnost' }] },
  { id: 9, name: 'Adnan', lastName: 'Mujkić', classId: '8-1', grades: [{ value: 3, date: '2025-08-07', type: 'Usmeni' }] },
  { id: 10, name: 'Ismar', lastName: 'Smajlović', classId: '8-1', grades: [{ value: 5, date: '2025-08-08', type: 'Kontrolni' }, { value: 5, date: '2025-08-09', type: 'Usmeni' }] },
];

const mockLessonPlan: LessonPlanItem[] = [
  { id: 1, topic: 'Aritmetika', unit: 'Osnove aritmetike' },
  { id: 2, topic: 'Geometrija', unit: 'Uvod u geometriju' },
  { id: 3, topic: 'Algebra', unit: 'Linearne jednačine' },
];

export default function ClassPage() {
  const params = useParams();
  const { classId } = params;

  const [activeTab, setActiveTab] = useState('Upis časa');
  const [students, setStudents] = useState(initialStudents);
  const [isFinalizingGrades, setIsFinalizingGrades] = useState(false);
  const [writtenAssignments, setWrittenAssignments] = useState<WrittenAssignment[]>([]);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedStudentForGrades, setSelectedStudentForGrades] = useState<Student | null>(null);

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
  const [newGradeType, setNewGradeType] = useState('');

  // States for Plan i program
  const [lessonPlan, setLessonPlan] = useState<LessonPlanItem[]>(mockLessonPlan);
  const [newTopic, setNewTopic] = useState('');
  const [newUnit, setNewUnit] = useState('');

  // States for Pismene zadaće
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDate, setNewAssignmentDate] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');

  const navItems = ['Upis časa', 'Prisustvo', 'Ocjene', 'Plan i program', 'Pismene zadaće'];
  const gradeTypes = ['Usmeni', 'Kontrolni', 'Zadaća', 'Aktivnost', 'Projekt', 'Domaći'];

  // Funkcije za brisanje
  const handleDeleteLessonPlanItem = (id: number) => {
    const confirmation = window.confirm("Jeste li sigurni da želite obrisati ovu nastavnu jedinicu?");
    if (confirmation) {
      setLessonPlan(prev => prev.filter(item => item.id !== id));
      alert("Nastavna jedinica uspješno obrisana.");
    }
  };

  const handleDeleteAssignment = (id: number) => {
    const confirmation = window.confirm("Jeste li sigurni da želite obrisati ovu pismenu zadaću?");
    if (confirmation) {
      setWrittenAssignments(prev => prev.filter(item => item.id !== id));
      alert("Pismena zadaća uspješno obrisana.");
    }
  };
  
  // Ažurirana funkcija za brisanje ocjene
  const handleDeleteGrade = (studentId: number, gradeDate: string, gradeType: string) => {
    const confirmation = window.confirm("Jeste li sigurni da želite obrisati ovu ocjenu?");
    if (confirmation) {
      const updatedStudents = students.map(student =>
        student.id === studentId
          ? {
              ...student,
              grades: student.grades.filter(grade => !(grade.date === gradeDate && grade.type === gradeType)),
            }
          : student
      );
      setStudents(updatedStudents);
      
      // Ažuriranje selectedStudentForGrades state-a kako bi se modal ažurirao
      const updatedStudent = updatedStudents.find(s => s.id === studentId);
      if (updatedStudent) {
        setSelectedStudentForGrades(updatedStudent);
      }
    }
  };

  // Funkcije za otvaranje/zatvaranje modala
  const openGradeModal = (student: Student) => {
    setSelectedStudentForGrades(student);
    setIsGradeModalOpen(true);
  };

  const closeGradeModal = () => {
    setIsGradeModalOpen(false);
    setSelectedStudentForGrades(null);
  };

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
    if (selectedStudentId && newGrade && gradeDate && newGradeType) {
      const today = new Date().toISOString().split('T')[0];
      if (gradeDate > today) {
        alert('Datum ne može biti u budućnosti.');
        return;
      }
      
      const grade = { value: newGrade as number, date: gradeDate, type: newGradeType };
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
      setNewGradeType('');
      setGradeSearchTerm('');
    } else {
      alert("Molimo popunite sva polja: učenik, ocjena, datum i vrsta ocjene.");
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
  
  // Ažurirana funkcija za prelazak na prisustvo s provjerom
  const handleSaveLessonAndMoveToAttendance = () => {
    if (lessonDescription.trim() === '') {
      alert("Molimo unesite opis časa prije nego što pređete na prisustvo.");
      return;
    }
    setActiveTab('Prisustvo');
  };

  const handleSaveAttendanceAndMoveToGrades = () => setActiveTab('Ocjene');
  const handleFinalizeGradesAndMoveToPlan = () => setActiveTab('Plan i program');
  const handleLessonNotHeld = () => {
    const confirmation = window.confirm("Da li ste sigurni da želite unijeti da čas nije održan? Uneseni opis će biti sačuvan.");
    if (confirmation) {
      alert("Čas je uspješno unesen kao da nije održan.");
    }
  };

  const handleAddAssignment = () => {
    if (!newAssignmentTitle || !newAssignmentDate) {
      alert("Molimo unesite naziv i datum pismene zadaće.");
      return;
    }
    const newAssignment = {
      id: writtenAssignments.length + 1,
      title: newAssignmentTitle,
      date: newAssignmentDate,
    };
    setWrittenAssignments([...writtenAssignments, newAssignment]);
    setNewAssignmentTitle('');
    setNewAssignmentDate('');
    alert('Pismena zadaća uspješno dodana!');
  };

  const handleAddLessonPlanItem = () => {
    if (!newTopic || !newUnit) {
      alert("Molimo unesite i nastavnu cjelinu i nastavnu jedinicu.");
      return;
    }
    const newItem = {
      id: lessonPlan.length + 1,
      topic: newTopic,
      unit: newUnit,
    };
    setLessonPlan([...lessonPlan, newItem]);
    setNewTopic('');
    setNewUnit('');
    alert('Nova nastavna jedinica uspješno dodana!');
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
                  {student.grades.length > 0
                    ? student.grades.map(g => g.value).join(', ')
                    : 'N/A'}
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
          <select
            className={styles.searchInput}
            value={newGradeType}
            onChange={(e) => setNewGradeType(e.target.value)}
          >
            <option value="">Vrsta ocjene</option>
            {gradeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button onClick={handleAddGrade} className={styles.gradeActionButton}>
            Upiši ocjenu
          </button>
        </div>

        <h3 className={styles.sectionTitle}>Učenici sa najmanje ocjena:</h3>
        <table className={styles.studentsList}>
          <thead>
            <tr>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Broj ocjena</th>
              <th>Prikaz ocjena</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithLeastGrades.map(student => (
              <tr key={student.id} className={styles.clickableRow} onClick={() => openGradeModal(student)}>
                <td>{student.name}</td>
                <td>{student.lastName}</td>
                <td>{student.grades.length}</td>
                <td>
                  {student.grades.length > 0
                    ? student.grades.map(g => g.value).join(', ')
                    : 'Nema ocjena'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.gradesFooter}>
          <button className={`${styles.nextButton} ${styles.gray}`} onClick={() => setIsFinalizingGrades(true)}>
            Pređi na zaključivanje ocjena
          </button>
          <button className={styles.nextButton} onClick={() => setActiveTab('Plan i program')}>
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
        return (
          <div className={styles.formSection}>
            <div className={styles.textAreaContainer}>
              <label htmlFor="nastavnaJedinica" className={styles.textAreaLabel}>Opis časa br. 44</label>
              <textarea
                id="nastavnaJedinica"
                className={styles.textArea}
                placeholder="Nastavna jedinica"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" id="onlineCas" />
                <label htmlFor="onlineCas">Online čas</label>
              </div>
              <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.red}`} onClick={handleLessonNotHeld}>Čas nije održan</button>
                <button className={`${styles.button} ${styles.green}`} onClick={handleSaveLessonAndMoveToAttendance}>Spasi i pređi na prisustvo</button>
              </div>
            </div>
          </div>
        );
      case 'Prisustvo':
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
              <button className={styles.nextButton} onClick={handleSaveAttendanceAndMoveToGrades}>Spasi i pređi na ocjene</button>
            </div>
          </div>
        );
      case 'Ocjene':
        return renderOcjeneTab();
      case 'Plan i program':
        return (
          <div className={styles.planZadacaContainer}>
            <h2 className={styles.sectionTitle}>Plan i program</h2>
            <p>Ovdje možete pregledati i uređivati plan i program za predmet (npr. Matematika).</p>
            <table className={styles.studentsList}>
              <thead>
                <tr>
                  <th>Redni broj</th>
                  <th>Nastavna cjelina</th>
                  <th>Nastavna jedinica</th>
                  <th>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {lessonPlan.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.topic}</td>
                    <td>{item.unit}</td>
                    <td>
                      <button className={styles.deleteButton} onClick={() => handleDeleteLessonPlanItem(item.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.addLessonContainer}>
              <h3>Dodaj novu nastavnu jedinicu:</h3>
              <div className={styles.zadacaInputContainer}>
                <label htmlFor="topic">Nastavna cjelina:</label>
                <input
                  type="text"
                  id="topic"
                  className={styles.inputField}
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Unesite nastavnu cjelinu"
                />
              </div>
              <div className={styles.zadacaInputContainer}>
                <label htmlFor="unit">Nastavna jedinica:</label>
                <input
                  type="text"
                  id="unit"
                  className={styles.inputField}
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Unesite nastavnu jedinicu"
                />
              </div>
              <div className={styles.saveContainer}>
                <button className={styles.nextButton} onClick={handleAddLessonPlanItem}>Dodaj</button>
              </div>
            </div>
          </div>
        );
      case 'Pismene zadaće':
        return (
          <div className={styles.planZadacaContainer}>
            <h2 className={styles.sectionTitle}>Pismene zadaće</h2>
            <p>Ovdje možete kreirati i pregledati pismene zadaće.</p>
            <div className={styles.zadacaInputContainer}>
              <label htmlFor="zadacaNaziv">Naziv pismene zadaće:</label>
              <input
                type="text"
                id="zadacaNaziv"
                className={styles.inputField}
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
              />
            </div>
            <div className={styles.zadacaInputContainer}>
              <label htmlFor="zadacaDatum">Datum održavanja:</label>
              <input
                type="date"
                id="zadacaDatum"
                className={styles.inputField}
                value={newAssignmentDate}
                onChange={(e) => setNewAssignmentDate(e.target.value)}
              />
            </div>
            <div className={styles.saveContainer}>
              <button className={styles.nextButton} onClick={handleAddAssignment}>Dodaj pismenu zadaću</button>
            </div>
            <h3 className={styles.gradesTable}>Lista pismenih zadaća:</h3>
            {writtenAssignments.length > 0 ? (
              <table className={styles.studentsList}>
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Datum</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {writtenAssignments.map(zadaca => (
                    <tr key={zadaca.id}>
                      <td>{zadaca.title}</td>
                      <td>{zadaca.date}</td>
                      <td>
                        <button className={styles.deleteButton} onClick={() => handleDeleteAssignment(zadaca.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nema unesenih pismenih zadaća.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderGradeModal = () => {
    if (!selectedStudentForGrades) return null;
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button onClick={closeGradeModal} className={styles.closeButton}>
            <FaTimes />
          </button>
          <h3>Ocjene za {selectedStudentForGrades.name} {selectedStudentForGrades.lastName}</h3>
          <table className={styles.studentsList}>
            <thead>
              <tr>
                <th>Ocjena</th>
                <th>Vrsta ocjene</th>
                <th>Datum</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudentForGrades.grades.map((grade, index) => (
                <tr key={index}>
                  <td>{grade.value}</td>
                  <td>{grade.type}</td>
                  <td>{grade.date}</td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleDeleteGrade(selectedStudentForGrades.id, grade.date, grade.type)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
              setIsFinalizingGrades(false);
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={styles.contentContainer}>
        {renderContent()}
      </div>
      {isGradeModalOpen && renderGradeModal()}
    </div>
  );
}