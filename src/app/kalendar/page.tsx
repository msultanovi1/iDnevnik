// src/app/kalendar/page.tsx
import styles from './kalendar.module.css';

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getDayOfWeekIndex = (date: Date) => {
  const day = date.getDay();
  // Adjust for Croatian/European calendar where Monday is the first day of the week (1), and Sunday is the last (0)
  return day === 0 ? 6 : day - 1;
};

export default function CalendarPage() {
  const daysOfWeek = ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'];
  const monthNames = ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'];

  // Get the current date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // getMonth returns a 0-indexed month (0-11)
  const currentDay = today.getDate();
  
  const days = getDaysInMonth(year, month);
  const firstDayIndex = getDayOfWeekIndex(days[0]);

  type ClassEvent = {
    subject: string;
    group?: string;
    color: string;
  };

  const classes: { [key: number]: ClassEvent[] } = {
    16: [
      { subject: '8-1', group: '8-2', color: 'green' },
      { subject: '8-1', group: '8-2', color: 'green' },
      { subject: '8-1', group: '8-3', color: 'green' },
    ],
    17: [
      { subject: '8-1', group: '8-2', color: 'red' },
      { subject: '8-1', group: '8-2', color: 'red' },
      { subject: '8-3', color: 'red' },
    ],
    18: [
      { subject: '7-1', group: '7-2', color: 'red' },
      { subject: '7-1', group: '7-2', color: 'red' },
      { subject: '7-3', color: 'red' },
    ],
    19: [
      { subject: '7-1', group: '7-2', color: 'red' },
      { subject: '7-1', group: '7-2', color: 'red' },
      { subject: '7-3', color: 'red' },
    ],
    20: [
      { subject: '9-1', group: '9-2', color: 'red' },
      { subject: '9-1', group: '9-2', color: 'red' },
      { subject: '9-3', color: 'red' },
    ],
  };

  return (
    <div className={styles.calendarContainer}>
      <h1 className={styles.header}>{`${monthNames[month]} ${year}`}</h1>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.dayOfWeek}>{day}</div>
        ))}
        {Array.from({ length: firstDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.day}></div>
        ))}
        {days.map(day => {
          const dayNumber = day.getDate();
          const isCurrentDay = dayNumber === currentDay;
          const classNames = `${styles.day} ${isCurrentDay ? styles.currentDay : ''}`;
          
          return (
            <div key={dayNumber} className={classNames}>
              <span className={styles.dayNumber}>{dayNumber}</span>
              {classes[dayNumber]?.map((event, index) => (
                <div key={index} className={`${styles.event} ${styles.classes}`}>
                  {event.subject}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}