// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from '../layout.module.css';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  // Mock podaci za obavijesti
  const announcements = [
    { id: 1, title: 'Test iz matematike', content: 'Testiranje znanja iz poglavlja Aritmetika, 8-1 odjeljenje.' },
    { id: 2, title: 'Sastanak s roditeljima', content: 'Sastanak roditelja odjeljenja 8-3 će se održati u srijedu u 18:00h.' },
  ];

  // Mock podaci za raspored nastavnika
  const dailySchedule = [
    { subject: 'Bosanski jezik', department: '8-1', startTime: '08:00', endTime: '08:45', description: 'Analiza romana "Travnička hronika".' },
    { subject: 'Matematika', department: '8-3', startTime: '08:50', endTime: '09:35', description: 'Priprema za test iz algebre.' },
    { subject: 'Muzička kultura', department: '8-2', startTime: '09:40', endTime: '10:25', description: 'Slušanje i analiza klasične muzike.' },
    { subject: 'Fizičko vaspitanje', department: '8-1', startTime: '10:45', endTime: '11:30', description: 'Atletika i priprema za školsko takmičenje.' },
    { subject: 'Engleski jezik', department: '8-3', startTime: '11:35', endTime: '12:20', description: 'Vježba konverzacije i vokabulara.' },
    { subject: 'Hemija', department: '8-1', startTime: '12:25', endTime: '17:10', description: 'Laboratorijske vježbe. Provjera znanja.' },
    { subject: 'Matematika', department: '8-1', startTime: '17:10', endTime: '18:30', description: 'Geometrija.' },
  ];

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Ažurira trenutno vrijeme svake minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 sekundi

    return () => clearInterval(timer); // Čisti timer
  }, []);

  // Logika za izračunavanje napretka unutar individualnog časa
  const calculateLessonProgress = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(now.toDateString() + ' ' + startTime);
    const end = new Date(now.toDateString() + ' ' + endTime);

    if (now < start || now > end) {
      // Čas još nije počeo ili je već završen
      return now > end ? 100 : 0;
    }

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();
    const progressPercentage = (elapsedDuration / totalDuration) * 100;
    
    return Math.min(Math.max(progressPercentage, 0), 100);
  };
  

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Dobar dan, {session?.user?.name || "Nastavniče"}!</h1>

      {/* Obavještenja */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Glavna obavještenja</h2>
        {announcements.map(announcement => (
          <div key={announcement.id} className={styles.announcementItem}>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
          </div>
        ))}
      </div>

      {/* Današnji raspored - Vertikalni timeline */}
      <div className={styles.sectionCard}>
        <h2 className={styles.cardTitle}>Današnji časovi</h2>
        <div className={styles.verticalTimeline}>
          {dailySchedule.map((lesson, index) => {
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
    </div>
  );
}