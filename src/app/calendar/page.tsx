// src/app/page.tsx
import styles from './page.module.css';

export default function Home() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const formattedDate = new Intl.DateTimeFormat('hr-HR', options).format(currentDate);

  const scheduleData = [
    {
      subject: '8-1 (Grupa B)',
      activity: 'Laboratorijski rad',
      status: 'Nije realizovan',
      time: '08:00h'
    },
    {
      subject: '8-1 (Grupa B)',
      activity: 'Automatika',
      status: 'Realizovan',
      time: '08:50h'
    },
    {
      subject: '8-1 (Grupa B)',
      activity: '',
      status: '',
      time: '09:40h'
    },
    {
      subject: '',
      activity: '',
      status: '',
      time: '10:45h'
    },
    {
      subject: '',
      activity: '',
      status: '',
      time: '11:35h'
    },
  ];

  return (
    <div className={styles.homePage}>
      <div className={styles.greetingSection}>
        <h1 className={styles.greeting}>Dobar dan, Ime Prezime!</h1>
        <p className={styles.welcomeMessage}>Dobrodošli na iDnevnik</p>
      </div>

      <div className={styles.todaySection}>
        <h2 className={styles.todayHeader}>Danas</h2>
        <p className={styles.date}>{formattedDate}</p>
      </div>

      <div className={styles.scheduleTimeline}>
        {scheduleData.map((item, index) => (
          <div key={index} className={styles.scheduleCard}>
            <div className={styles.scheduleCardContent}>
              {item.subject && <div className={styles.subject}>{item.subject}</div>}
              {item.activity && <div className={styles.group}>{item.activity}</div>}
              {item.status && (
                <>
                  <div className={styles.statusItem}>
                    <span className={`${styles.statusIcon} ${item.status === 'Nije realizovan' ? styles.error : ''}`}>
                      {item.status === 'Nije realizovan' ? '⚠️' : '✅'}
                    </span>
                    <span>{item.status}</span>
                  </div>
                  {item.status === 'Realizovan' && (
                    <div className={styles.statusItem}>
                      {/* This is the corrected line */}
                      <span className={styles.statusIcon}>✅</span>
                      <span>Uneseno prisustvo</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={styles.timelineMarker}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}