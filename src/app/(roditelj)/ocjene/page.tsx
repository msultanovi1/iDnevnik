// src/app/(roditelj)/ocjene/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './ocjene.module.css';
import { FaBook, FaStar, FaChartBar, FaUserGraduate } from 'react-icons/fa';

// Mock podaci za ocjene
const mockGradesData = {
    child1: {
        polugodiste1: [
            { subject: 'Matematika', grades: [{ value: 5, date: '20.09.2024.' }, { value: 4, date: '15.10.2024.' }, { value: 5, date: '21.11.2024.' }] },
            { subject: 'Bosanski jezik', grades: [{ value: 4, date: '05.10.2024.' }, { value: 3, date: '10.11.2024.' }] },
            { subject: 'Historija', grades: [{ value: 2, date: '01.12.2024.' },  { value: 1, date: '10.12.2024.' },  { value: 4, date: '13.12.2024.' }]},
            { subject: 'Fizika', grades: [] },
        ],
        polugodiste2: [
            { subject: 'Matematika', grades: [{ value: 4, date: '15.02.2025.' }, { value: 4, date: '10.03.2025.' }] },
            { subject: 'Engleski jezik', grades: [{ value: 5, date: '01.03.2025.' }, { value: 5, date: '25.04.2025.' }] },
        ]
    },
    child2: {
        polugodiste1: [
            { subject: 'Matematika', grades: [{ value: 3, date: '10.10.2024.' }, { value: 3, date: '25.11.2024.' }] },
            { subject: 'Biologija', grades: [{ value: 4, date: '18.10.2024.' }, { value: 5, date: '20.11.2024.' }] },
        ],
        polugodiste2: [
            { subject: 'Matematika', grades: [{ value: 4, date: '20.03.2025.' }] },
            { subject: 'Biologija', grades: [{ value: 4, date: '10.04.2025.' }] },
        ]
    }
};

const mockChildren = [
    { id: 'child1', name: 'Petar Petrović' },
    { id: 'child2', name: 'Ana Anić' }
];

const OcjenePage = () => {
    const searchParams = useSearchParams();
    const childId = searchParams.get('dijete') as keyof typeof mockGradesData | null;
    const [activeSemester, setActiveSemester] = useState<'polugodiste1' | 'polugodiste2'>('polugodiste1');

    const gradesData = childId && mockGradesData[childId] ? mockGradesData[childId] : null;
    const selectedChildName = mockChildren.find(c => c.id === childId)?.name;

    if (!childId || !selectedChildName) {
        return <div className={styles.container}>Molimo odaberite dijete iz menija da vidite ocjene.</div>;
    }

    if (!gradesData) {
        return <div className={styles.container}>Podaci za odabrano dijete nisu pronađeni.</div>;
    }

    const currentSemesterData = gradesData[activeSemester];

    // Funkcija za izračunavanje prosjeka po predmetu
    const calculateSubjectAverage = (grades: { value: number }[]) => {
        if (grades.length === 0) return 'N/A';
        const sum = grades.reduce((acc, curr) => acc + curr.value, 0);
        return (sum / grades.length).toFixed(2);
    };

    // Funkcija za izračunavanje ukupnog prosjeka
    const calculateOverallAverage = () => {
        const allGrades = currentSemesterData.flatMap(item => item.grades.map(grade => grade.value));
        if (allGrades.length === 0) return 'N/A';
        const sum = allGrades.reduce((acc, curr) => acc + curr, 0);
        return (sum / allGrades.length).toFixed(2);
    };

    const overallAverage = calculateOverallAverage();
    
    // Funkcija koja vraća CSS klasu za boju ocjene
    const getGradeColorClass = (value: number) => {
        switch (value) {
            case 5: return styles.gradeColor5;
            case 4: return styles.gradeColor4;
            case 3: return styles.gradeColor3;
            case 2: return styles.gradeColor2;
            case 1: return styles.gradeColor1;
            default: return '';
        }
    };

    return (
        <div className={styles.ocjenePage}>
            {/* NOVO: Prikaz imena djeteta */}
            <div className={styles.childNameHeader}>
                <FaUserGraduate className={styles.childIcon} />
                <h1>Ocjene za: {selectedChildName}</h1>
            </div>
            
            <div className={styles.headerContainer}>
                <div className={styles.semesterSelector}>
                    <button
                        className={`${styles.semesterButton} ${activeSemester === 'polugodiste1' ? styles.active : ''}`}
                        onClick={() => setActiveSemester('polugodiste1')}
                    >
                        Prvo polugodište
                    </button>
                    <button
                        className={`${styles.semesterButton} ${activeSemester === 'polugodiste2' ? styles.active : ''}`}
                        onClick={() => setActiveSemester('polugodiste2')}
                    >
                        Drugo polugodište
                    </button>
                </div>
                <div className={styles.overallAverage}>
                    <FaChartBar className={styles.icon} />
                    Ukupni prosjek: <span>{overallAverage}</span>
                </div>
            </div>

            <div className={styles.subjectsGrid}>
                {currentSemesterData.length === 0 ? (
                    <div className={styles.noOcjene}>Nema unesenih ocjena za ovo polugodište.</div>
                ) : (
                    currentSemesterData.map(subjectData => (
                        <div key={subjectData.subject} className={styles.subjectCard}>
                            <div className={styles.subjectHeader}>
                                <FaBook className={styles.subjectIcon} />
                                <h3>{subjectData.subject}</h3>
                            </div>
                            <div className={styles.subjectDetails}>
                                <div className={styles.subjectAverage}>
                                    Prosjek: <span>{calculateSubjectAverage(subjectData.grades)}</span>
                                </div>
                                <div className={styles.gradesList}>
                                    {subjectData.grades.length > 0 ? (
                                        subjectData.grades.map((grade, index) => (
                                            <div key={index} className={styles.gradeItem}>
                                                <span className={`${styles.gradeValue} ${getGradeColorClass(grade.value)}`}><FaStar /> {grade.value}</span>
                                                <span className={styles.gradeDate}>{grade.date}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className={styles.noOcjeneSubject}>Nema unesenih ocjena.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OcjenePage;