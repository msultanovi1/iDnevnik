"use client";

import { useState } from 'react';
import styles from './notifications.module.css';
import { FaSearch, FaTimes, FaCalendarAlt, FaSortAmountDownAlt, FaSortAmountUpAlt } from 'react-icons/fa';

// NOVO: Uvozimo React Date Picker i njegove stilove
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// NOVO: Uvozimo bosanski jezik
import { bs } from 'date-fns/locale';

// NOVO: Registrujemo bosanski jezik za date picker
registerLocale('bs', bs);

// Definiramo tip za obavijest
type Notification = {
    id: number;
    title: string;
    date: string;
    summary: string;
    content: string;
};

// Mock podaci za obavijesti
const mockNotifications: Notification[] = [
    {
        id: 1,
        title: 'Nova ocjena iz matematike',
        date: '25.08.2025.',
        summary: 'Učenik je dobio ocjenu 5 iz matematike.',
        content: 'Učenik Marko Marić je 25.08.2025. dobio ocjenu 5 (odličan) iz predmeta Matematika. Ocjenu je upisao nastavnik Ivan Horvat.'
    },
    {
        id: 2,
        title: 'Obavijest o izostanku',
        date: '24.08.2025.',
        summary: 'Obavještavamo vas o neopravdanom izostanku.',
        content: 'Poštovani roditelji, ovim putem vas obavještavamo da je vaše dijete Ana Anić neopravdano izostalo s nastave dana 24.08.2025. u trajanju od jednog sata. Molimo vas da opravdate izostanak.'
    },
    {
        id: 3,
        title: 'Predstojeći roditeljski sastanak',
        date: '23.08.2025.',
        summary: 'Podsjetnik na roditeljski sastanak 30.08.',
        content: 'Poštovani, podsjećamo vas na roditeljski sastanak koji će se održati u petak, 30.08.2025. u 18:00 sati u prostorijama škole. Prisustvo je obavezno.'
    },
    {
        id: 4,
        title: 'Nova obavijest',
        date: '22.08.2025.',
        summary: 'Evo još jedne obavijesti.',
        content: 'Ovo je još jedna dodatna obavijest da vidimo kako će se prikazivati na stranici.'
    },
];

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    
    // NOVO: Stanje za odabrani datum, sada kao Date objekt
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); 

    // Sortiranje obavijesti po datumu
    const sortedNotifications = [...notifications].sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));

        if (sortOrder === 'desc') {
            return dateB.getTime() - dateA.getTime();
        } else {
            return dateA.getTime() - dateB.getTime();
        }
    });

    // Filtriranje obavijesti na osnovu unesenog teksta i datuma
    const filteredNotifications = sortedNotifications.filter(notification => {
        const matchesSearchTerm = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || notification.summary.toLowerCase().includes(searchTerm.toLowerCase());
        
        // NOVO: Provjera datuma, formatiramo ga za poređenje
        const notificationDateFormatted = new Date(notification.date.split('.').reverse().join('-')).toISOString().slice(0, 10);
        const selectedDateFormatted = selectedDate ? selectedDate.toISOString().slice(0, 10) : '';

        const matchesDate = selectedDate ? notificationDateFormatted === selectedDateFormatted : true;

        return matchesSearchTerm && matchesDate;
    });

    const handleNotificationClick = (notification: Notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'desc' ? 'asc' : 'desc'));
    };

    return (
        <div className={styles.notificationsContainer}>
            <h1 className={styles.pageTitle}>Obavijesti</h1>

            <div className={styles.controlsBar}>
                <div className={styles.searchBar}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Pretražite obavijesti..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* NOVO: Zamijenili smo nativni input sa DatePicker-om */}
                <div className={styles.dateFilter}>
                    <FaCalendarAlt className={styles.dateIcon} />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        placeholderText="Odaberi datum"
                        dateFormat="dd.MM.yyyy"
                        locale="bs"
                        className={styles.dateInput}
                    />
                    {selectedDate && (
                        <button className={styles.clearDateButton} onClick={() => setSelectedDate(null)}>
                            <FaTimes />
                        </button>
                    )}
                </div>
                <button className={styles.sortButton} onClick={toggleSortOrder}>
                    {sortOrder === 'desc' ? (
                        <>
                            <FaSortAmountDownAlt /> Najnovije
                        </>
                    ) : (
                        <>
                            <FaSortAmountUpAlt /> Najstarije
                        </>
                    )}
                </button>
            </div>

            <div className={styles.notificationList}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={styles.notificationItem}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className={styles.notificationHeader}>
                                <span className={styles.notificationTitle}>{notification.title}</span>
                                <span className={styles.notificationDate}>{notification.date}</span>
                            </div>
                            <p className={styles.notificationSummary}>{notification.summary}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noResults}>Nema rezultata za vašu pretragu.</p>
                )}
            </div>

            {selectedNotification && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        <h2 className={styles.modalTitle}>{selectedNotification.title}</h2>
                        <p className={styles.modalDate}>{selectedNotification.date}</p>
                        <p className={styles.modalText}>{selectedNotification.content}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;