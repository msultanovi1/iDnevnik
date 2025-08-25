// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from '../layout.module.css';
import { useSession } from 'next-auth/react';
import { useChild } from '../context/ChildContext';

// Dodajemo tipove
type Announcement = {
  id: number;
  title: string;
  content: string;
};

type Lesson = {
  subject: string;
  department: string;
  startTime: string;
  endTime: string;
  description?: string;
};

type ChildDataMap<T> = { [key: string]: T[] };


export default function DashboardPage() {
  const { data: session } = useSession();
  const { selectedChild } = useChild();

  // --- MOCK PODACI ZA NASTAVNIKA ---
  const teacherAnnouncements: Announcement[] = [
    { id: 1, title: 'Test iz matematike', content: 'Testiranje znanja iz poglavlja Aritmetika, 8-1 odjeljenje.' },
    { id: 2, title: 'Sastanak s roditeljima', content: 'Sastanak roditelja odjeljenja 8-3 će se održati u srijedu u 18:00h.' },
  ];

  const teacherDailySchedule: Lesson[] = [
    { subject: 'Bosanski jezik', department: '8-1', startTime: '08:00', endTime: '08:45', description: 'Analiza romana "Travnička hronika".' },
    { subject: 'Matematika', department: '8-3', startTime: '08:50', endTime: '09:35', description: 'Priprema za test iz algebre.' },
    { subject: 'Muzička kultura', department: '8-2', startTime: '09:40', endTime: '10:25', description: 'Slušanje i analiza klasične muzike.' },
    { subject: 'Fizičko vaspitanje', department: '8-1', startTime: '10:45', endTime: '11:30', description: 'Atletika i priprema za školsko takmičenje.' },
    { subject: 'Engleski jezik', department: '8-3', startTime: '11:35', endTime: '12:20', description: 'Vježba konverzacije i vokabulara.' },
    { subject: 'Hemija', department: '8-1', startTime: '12:25', endTime: '17:10', description: 'Laboratorijske vježbe. Provjera znanja.' },
    { subject: 'Matematika', department: '8-1', startTime: '17:10', endTime: '18:30', description: 'Geometrija.' },
  ];

  const calculateLessonProgress = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(now.toDateString() + ' ' + startTime);
    const end = new Date(now.toDateString() + ' ' + endTime);

    if (now < start || now > end) {
      return now > end ? 100 : 0;
    }

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();
    const progressPercentage = (elapsedDuration / totalDuration) * 100;
    return Math.min(Math.max(progressPercentage, 0), 100);
  };
  
  // --- MOCK PODACI ZA RODITELJA ---
  const announcementsByChild: ChildDataMap<Announcement> = {
    'child1': [
      { id: 1, title: 'Izlet za 8-1', content: 'Izlet će se održati 15.10. u Sarajevu.' },
      { id: 2, title: 'Promjena rasporeda', content: 'U utorak se pomjera čas matematike za Petrove razrede.' },
    ],
    'child2': [
      { id: 1, title: 'Roditeljski sastanak', content: 'Sastanak roditelja odjeljenja 8-2 će se održati u srijedu u 18:00h.' },
    ],
  };

  const dailyScheduleByChild: ChildDataMap<Lesson> = {
    'child1': [
      { subject: 'Matematika', department: '8-1', startTime: '08:50', endTime: '09:35' },
      { subject: 'Muzička kultura', department: '8-1', startTime: '09:40', endTime: '10:25' },
      { subject: 'Fizičko vaspitanje', department: '8-1', startTime: '10:45', endTime: '11:30' },
    ],
    'child2': [
      { subject: 'Matematika', department: '8-2', startTime: '08:50', endTime: '09:35' },
      { subject: 'Engleski jezik', department: '8-2', startTime: '11:35', endTime: '12:20' },
      { subject: 'Hemija', department: '8-2', startTime: '12:25', endTime: '17:10' },
    ],
  };
  
  const renderDashboardContent = () => {
    if (session?.user?.role === "NASTAVNIK") {
      return (
        <>
          <h1 className={styles.pageTitle}>Dobrodošli, {session?.user?.name || "Nastavniče"}!</h1>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Glavna obavještenja</h2>
            {teacherAnnouncements.map(announcement => (
              <div key={announcement.id} className={styles.announcementItem}>
                <h3>{announcement.title}</h3>
                <p>{announcement.content}</p>
              </div>
            ))}
          </div>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Današnji časovi</h2>
            <div className={styles.verticalTimeline}>
              {teacherDailySchedule.map((lesson, index) => {
                const progress = calculateLessonProgress(lesson.startTime, lesson.endTime);
                const isActive = progress > 0 && progress < 100;
                const isCompleted = progress === 100;
                return (
                  <div 
                    key={index} 
                    className={`${styles.lessonCard} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
                  >
                    <div className={styles.lessonProgressBar} style={{ height: `${progress}%` }}></div>
                    <div className={styles.lessonContent}>
                      <p className={styles.lessonSubject}>{lesson.subject}</p>
                      <p className={styles.lessonDepartment}>{lesson.department} odjeljenje</p>
                      <p className={styles.lessonTime}>{lesson.startTime} - {lesson.endTime}</p>
                      <hr className={styles.separator} />
                      <p className={styles.lessonDescription}>{lesson.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    }
    
    if (session?.user?.role === "RODITELJ") {
      return (
        <>
          <h1 className={styles.pageTitle}>Dobrodošli, {session?.user?.name || "Roditelju"}!</h1>
          {selectedChild && (
            <h2 className={styles.subtitle}>Trenutno pregledavate: <span className={styles.childName}>{selectedChild.name}</span></h2>
          )}
          {!selectedChild && (
            <div className={styles.sectionCard}>
              <p>Molimo odaberite dijete iz padajućeg menija u navigaciji da vidite obavještenja i raspored.</p>
            </div>
          )}
          {selectedChild && (
            <>
              <div className={styles.sectionCard}>
                <h2 className={styles.cardTitle}>Glavna obavještenja</h2>
                {announcementsByChild[selectedChild.id]?.length > 0 ? (
                  announcementsByChild[selectedChild.id].map(announcement => (
                    <div key={announcement.id} className={styles.announcementItem}>
                      <h3>{announcement.title}</h3>
                      <p>{announcement.content}</p>
                    </div>
                  ))
                ) : (
                  <p>Nema novih obavještenja za odabrano dijete.</p>
                )}
              </div>
              <div className={styles.sectionCard}>
                <h2 className={styles.cardTitle}>Današnji časovi</h2>
                {dailyScheduleByChild[selectedChild.id]?.length > 0 ? (
                  <div className={styles.simpleList}>
                    {dailyScheduleByChild[selectedChild.id].map((lesson, index) => (
                      <div key={index} className={styles.simpleListItem}>
                        <p className={styles.simpleSubject}>{lesson.subject} - {lesson.department}</p>
                        <p className={styles.simpleTime}>{lesson.startTime} - {lesson.endTime}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nema časova za danas za odabrano dijete.</p>
                )}
              </div>
            </>
          )}
        </>
      );
    }

    if (session?.user?.role === "UCENIK") {
      return (
        <>
          <h1 className={styles.pageTitle}>Dobrodošli, {session?.user?.name || "Učeniče"}!</h1>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Glavna obavještenja</h2>
            <p>Nema novih obavještenja.</p>
          </div>
          <div className={styles.sectionCard}>
            <h2 className={styles.cardTitle}>Današnji časovi</h2>
            <p>Nema časova za danas.</p>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className={styles.dashboardContainer}>
      {renderDashboardContent()}
    </div>
  );
}