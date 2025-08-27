"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import styles from './izostanci.module.css';
import { FaUserGraduate } from 'react-icons/fa';

interface Child {
    id: string;
    name: string;
}

const mockChildren: Child[] = [
    { id: 'child1', name: 'Petar Petrović' },
    { id: 'child2', name: 'Ana Anić' },
];

interface Absence {
    id: string;
    childId: string;
    date: string;
    subject: string | null;
    classPeriod: string;
    isJustified: boolean;
    justificationReason: string | null;
    semester: 1 | 2;
}

const mockAbsences: Absence[] = [
    {
        id: 'abs1',
        childId: 'child2',
        date: '2025-01-15',
        subject: 'Matematika',
        classPeriod: '1. čas',
        isJustified: true,
        justificationReason: 'Ljekarsko opravdanje',
        semester: 1
    },
    {
        id: 'abs2',
        childId: 'child2',
        date: '2025-02-20',
        subject: 'Fizika',
        classPeriod: '2-3. čas',
        isJustified: false,
        justificationReason: null,
        semester: 1
    },
    {
        id: 'abs7',
        childId: 'child2',
        date: '2025-02-25',
        subject: 'Informatika',
        classPeriod: '4. čas',
        isJustified: false,
        justificationReason: null,
        semester: 1
    },
    {
        id: 'abs3',
        childId: 'child1',
        date: '2025-01-10',
        subject: 'Bosanski jezik',
        classPeriod: '4. čas',
        isJustified: true,
        justificationReason: 'Porodični razlozi',
        semester: 1
    },
    {
        id: 'abs4',
        childId: 'child1',
        date: '2025-03-05',
        subject: null,
        classPeriod: 'Čitav dan',
        isJustified: false,
        justificationReason: null,
        semester: 1
    },
    {
        id: 'abs5',
        childId: 'child2',
        date: '2025-09-10',
        subject: 'Informatika',
        classPeriod: '5. čas',
        isJustified: false,
        justificationReason: null,
        semester: 2
    },
    {
        id: 'abs6',
        childId: 'child1',
        date: '2025-10-25',
        subject: 'Biologija',
        classPeriod: '1. čas',
        isJustified: false,
        justificationReason: null,
        semester: 2
    },
];

const getAbsencesByChildId = (id: string | null): Absence[] => {
    if (!id) return [];
    return mockAbsences.filter(abs => abs.childId === id);
};

const IzostanciPage = () => {
    const searchParams = useSearchParams();
    const childId = searchParams.get('dijete');

    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justifyingAbsence, setJustifyingAbsence] = useState<Absence | null>(null);
    const [justificationText, setJustificationText] = useState('');
    const [justificationFile, setJustificationFile] = useState<File | null>(null);
    const [justificationError, setJustificationError] = useState('');

    const [absences, setAbsences] = useState<Absence[]>([]);
    
    useEffect(() => {
        setAbsences(getAbsencesByChildId(childId));
    }, [childId]);

    const child = useMemo(() => {
        return mockChildren.find(c => c.id === childId);
    }, [childId]);

    const handleJustifyClick = (absence: Absence) => {
        setJustifyingAbsence(absence);
        setJustificationText('');
        setJustificationFile(null);
        setJustificationError('');
        setIsModalOpen(true);
    };

    const handleJustificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!justifyingAbsence) {
            setJustificationError('Nema odabranog izostanka za opravdanje.');
            return;
        }

        if (!justificationText && !justificationFile) {
            setJustificationError("Morate unijeti razlog ili priložiti dokument.");
            return;
        }

        console.log(`Pravdanje izostanka ${justifyingAbsence.id} sa razlogom: "${justificationText}" i priloženom datotekom: ${justificationFile?.name}`);
        alert('Izostanak je uspješno poslan na pravdanje!');

        setIsModalOpen(false);
        setJustifyingAbsence(null);
    };

    if (!childId || !child) {
        return (
            <div className={styles.container}>
                <div className={styles.noChildSelected}>
                    Molimo odaberite dijete iz bočnog menija.
                </div>
            </div>
        );
    }

    const absencesToDisplay = absences.filter(abs => abs.semester === selectedSemester);
    const totalAbsences = absencesToDisplay.length;
    const justifiedAbsences = absencesToDisplay.filter(abs => abs.isJustified).length;
    const unjustifiedAbsences = totalAbsences - justifiedAbsences;

    return (
        <div className={styles.container}>
            {/* Usklađeno zaglavlje s onim na stranici za ocjene */}
            <div className={styles.childNameHeader}>
                <FaUserGraduate className={styles.childIcon} />
                <h1>Izostanci za: {child.name}</h1>
            </div>

            {/* Usklađen kontejner za gumbe za polugodište */}
            <div className={styles.headerContainer}>
                <div className={styles.semesterButtons}>
                    <button
                        className={`${styles.semesterButton} ${selectedSemester === 1 ? styles.active : ''}`}
                        onClick={() => setSelectedSemester(1)}
                    >
                        Prvo polugodište
                    </button>
                    <button
                        className={`${styles.semesterButton} ${selectedSemester === 2 ? styles.active : ''}`}
                        onClick={() => setSelectedSemester(2)}
                    >
                        Drugo polugodište
                    </button>
                </div>
                {/* Opcionalno, možete dodati i ukupni zbroj izostanaka ovdje da bude slično kao prosjek */}
            </div>
            
            <div className={styles.absencesList}>
                {absencesToDisplay.length > 0 ? (
                    absencesToDisplay.map((abs: Absence) => (
                        <div key={abs.id} className={styles.absenceCard}>
                            <div className={styles.cardHeader}>
                                <h4>{abs.date}</h4>
                                <span className={`${styles.statusBadge} ${abs.isJustified ? styles.justified : styles.unjustified}`}>
                                    {abs.isJustified ? 'Opravdan' : 'Neopravdan'}
                                </span>
                            </div>
                            <div className={styles.cardBody}>
                                <p><strong>Predmet/Čas:</strong> {abs.subject || abs.classPeriod}</p>
                                <p><strong>Razlog:</strong> {abs.justificationReason || 'Nema unesenog razloga'}</p>
                            </div>
                            {!abs.isJustified && (
                                <div className={styles.cardFooter}>
                                    <button
                                        onClick={() => handleJustifyClick(abs)}
                                        className={styles.justifyButton}
                                    >
                                        Opravdaj
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        Nema izostanaka u ovom polugodištu.
                    </div>
                )}
            </div>

            {isModalOpen && justifyingAbsence && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button onClick={() => setIsModalOpen(false)} className={styles.closeModalButton}>&times;</button>
                        <h3 className={styles.modalTitle}>Opravdaj izostanak</h3>
                        <p>Datum: **{justifyingAbsence.date}**</p>
                        <p>Predmet: **{justifyingAbsence.subject || justifyingAbsence.classPeriod}**</p>
                        
                        <form onSubmit={handleJustificationSubmit} className={styles.justificationForm}>
                            <label htmlFor="justificationReason">Razlog izostanka:</label>
                            <textarea
                                id="justificationReason"
                                value={justificationText}
                                onChange={(e) => setJustificationText(e.target.value)}
                                placeholder="Unesite razlog..."
                                rows={4}
                            ></textarea>
                            
                            <label htmlFor="justificationFile" className={styles.fileLabel}>
                                Priložite ljekarsko opravdanje (opcionalno)
                            </label>
                            <input
                                type="file"
                                id="justificationFile"
                                onChange={(e) => setJustificationFile(e.target.files?.[0] || null)}
                            />
                            {justificationFile && <p className={styles.fileName}>{justificationFile.name}</p>}

                            {justificationError && <p className={styles.error}>{justificationError}</p>}
                            
                            <button type="submit" className={styles.submitButton}>
                                Pošalji opravdanje
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IzostanciPage;