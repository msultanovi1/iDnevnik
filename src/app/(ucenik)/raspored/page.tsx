// src/app/(ucenik)/raspored/page.tsx
"use client";

import { useState } from 'react';
import styles from './raspored.module.css';
import { FaCalendarAlt, FaSun, FaMoon } from 'react-icons/fa';
import { FaUserGraduate } from 'react-icons/fa';

interface Schedule {
    subject: string;
    classTime: string;
}

interface ShiftSchedule {
    [key: string]: Schedule[];
}

interface MockScheduleData {
    shift1: ShiftSchedule;
    shift2: ShiftSchedule;
}

const mockScheduleData: MockScheduleData = {
    shift1: {
        'Ponedjeljak': [
            { subject: 'Bosanski jezik', classTime: '08:00 - 08:45' },
            { subject: 'Matematika', classTime: '08:50 - 09:35' },
            { subject: 'Fizika', classTime: '09:40 - 10:25' },
            { subject: 'Biologija', classTime: '10:30 - 11:15' },
            { subject: 'Fizičko vaspitanje', classTime: '11:20 - 12:05' },
        ],
        'Utorak': [
            { subject: 'Matematika', classTime: '08:00 - 08:45' },
            { subject: 'Engleski jezik', classTime: '08:50 - 09:35' },
            { subject: 'Historija', classTime: '09:40 - 10:25' },
            { subject: 'Likovno', classTime: '10:30 - 11:15' },
        ],
        'Srijeda': [
            { subject: 'Matematika', classTime: '08:00 - 08:45' },
            { subject: 'Hemija', classTime: '08:50 - 09:35' },
            { subject: 'Muzičko', classTime: '09:40 - 10:25' },
        ],
        'Četvrtak': [
            { subject: 'Bosanski jezik', classTime: '08:00 - 08:45' },
            { subject: 'Informatika', classTime: '08:50 - 09:35' },
            { subject: 'Geografija', classTime: '09:40 - 10:25' },
        ],
        'Petak': [
            { subject: 'Matematika', classTime: '08:00 - 08:45' },
            { subject: 'Fizika', classTime: '08:50 - 09:35' },
            { subject: 'Fizičko vaspitanje', classTime: '09:40 - 10:25' },
            { subject: 'Vjeronauka', classTime: '10:30 - 11:15' },
        ]
    },
    shift2: {
        'Ponedjeljak': [
            { subject: 'Biologija', classTime: '13:00 - 13:45' },
            { subject: 'Matematika', classTime: '13:50 - 14:35' },
            { subject: 'Fizičko vaspitanje', classTime: '14:40 - 15:25' },
        ],
        'Utorak': [
            { subject: 'Bosanski jezik', classTime: '13:00 - 13:45' },
            { subject: 'Historija', classTime: '13:50 - 14:35' },
        ],
        'Srijeda': [
            { subject: 'Geografija', classTime: '13:00 - 13:45' },
            { subject: 'Hemija', classTime: '13:50 - 14:35' },
            { subject: 'Matematika', classTime: '14:40 - 15:25' },
            { subject: 'Muzičko', classTime: '15:30 - 16:15' },
        ],
        'Četvrtak': [
            { subject: 'Informatika', classTime: '13:00 - 13:45' },
            { subject: 'Fizika', classTime: '13:50 - 14:35' },
        ],
        'Petak': [
            { subject: 'Engleski jezik', classTime: '13:00 - 13:45' },
            { subject: 'Matematika', classTime: '13:50 - 14:35' },
            { subject: 'Bosanski jezik', classTime: '14:40 - 15:25' },
        ]
    }
};

const daysOfWeek = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];

const RasporedPage = () => {
    const [activeShift, setActiveShift] = useState<'shift1' | 'shift2'>('shift1');

    const currentSchedule = mockScheduleData[activeShift];

    return (
        <div className={styles.rasporedPage}>
            {/* Prilagođeno zaglavlje */}
            <div className={styles.childNameHeader}>
                <FaUserGraduate className={styles.childIcon} />
                <h1>Moj raspored</h1>
            </div>
            
            <div className={styles.headerContainer}>
                <div className={styles.semesterButtons}>
                    <button
                        className={`${styles.semesterButton} ${activeShift === 'shift1' ? styles.active : ''}`}
                        onClick={() => setActiveShift('shift1')}
                    >
                        <FaSun />
                        Prva smjena
                    </button>
                    <button
                        className={`${styles.semesterButton} ${activeShift === 'shift2' ? styles.active : ''}`}
                        onClick={() => setActiveShift('shift2')}
                    >
                        <FaMoon />
                        Druga smjena
                    </button>
                </div>
            </div>

            <div className={styles.scheduleGrid}>
                {daysOfWeek.map(day => (
                    <div key={day} className={styles.dayColumn}>
                        <h3 className={styles.dayHeader}>{day}</h3>
                        {currentSchedule[day] && currentSchedule[day].length > 0 ? (
                            currentSchedule[day].map((lesson, index) => (
                                <div key={index} className={styles.lessonCard}>
                                    <div className={styles.lessonTime}>{lesson.classTime}</div>
                                    <div className={styles.lessonSubject}>{lesson.subject}</div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noLessons}>Slobodan dan!</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RasporedPage;