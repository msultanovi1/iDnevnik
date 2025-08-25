// src/app/kalendar/page.tsx
'use client';

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './kalendar.module.css';

interface ClassInfo {
  id: number;
  time: string;
  name: string;
  grade: string;
}

const months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
const daysOfWeek = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

const generateMockData = () => {
  const data: { [key: string]: ClassInfo[] } = {};
  const startDate = new Date(2025, 7, 1); // August 1, 2025
  const endDate = new Date(2025, 8, 30); // September 30, 2025

  let currentDay = new Date(startDate);

  while (currentDay <= endDate) {
    const dayOfWeek = currentDay.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday (1) to Friday (5)

    if (isWeekday) {
      const year = currentDay.getFullYear();
      const month = String(currentDay.getMonth() + 1).padStart(2, '0');
      const day = String(currentDay.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      data[formattedDate] = [
        { id: 1, time: '09:00', name: 'Matematika', grade: '8-1' },
        { id: 2, time: '10:00', name: 'Fizika', grade: '8-2' },
        { id: 3, time: '11:00', name: 'Biologija', grade: '8-3' },
      ];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  }
  return data;
};

const mockData = generateMockData();

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const startOfSchoolYear = new Date(2025, 7, 1);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const totalDays = getDaysInMonth(year, month);
    const calendarDays = [];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startDayIndex = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

    for (let i = 0; i < startDayIndex; i++) {
      calendarDays.push(<div key={`empty-${i}`} className={styles.noClassDay} />);
    }

    const midnightToday = new Date();
    midnightToday.setHours(0, 0, 0, 0);

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const classes = mockData[formattedDate] || [];

      if (isWeekend) {
        calendarDays.push(<div key={day} className={styles.noClassDay} />);
        continue;
      }
      
      const isPassedDay = date < midnightToday;
      const dayClass = isPassedDay ? styles.passedDay : styles.futureDay;

      calendarDays.push(
        <div 
          key={day} 
          className={`${styles.dayCell} ${dayClass} ${isToday ? styles.today : ''}`}
        >
          <div className={styles.dayNumber}>{day}</div>
          <div className={styles.dayDetails}>
            {classes.length > 0 ? `${classes.length} čas` : 'Nema časa'}
          </div>
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <FaChevronLeft className={styles.navArrow} onClick={handlePreviousMonth} />
          <div className={styles.monthYear}>
            {months[month]} {year}
          </div>
          <FaChevronRight className={styles.navArrow} onClick={handleNextMonth} />
        </div>
        <div className={styles.daysOfWeek}>
          {daysOfWeek.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}