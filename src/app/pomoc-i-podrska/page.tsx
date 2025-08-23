'use client';

import { useState } from 'react';
import styles from './pomoc-i-podrska.module.css';

const faqs = [
  {
    question: 'Kako mogu promijeniti svoju lozinku?',
    answer: 'Lozinku možete promijeniti u postavkama profila. Kliknite na ikonu korisnika u gornjem desnom kutu, odaberite "Postavke profila", a zatim pronađite opciju "Promjena lozinke".',
  },
  {
    question: 'Gdje mogu pronaći ocjene svog djeteta?',
    answer: 'Ako ste roditelj, ocjene svog djeteta možete vidjeti u bočnom meniju, pod "Nastava" i "Ocjene djeteta".',
  },
  {
    question: 'Kome se mogu obratiti ako imam tehnički problem?',
    answer: 'Za tehničku podršku možete se obratiti školskoj administraciji slanjem pitanja putem ove forme. Molimo opišite problem detaljno kako bismo vam mogli pomoći što prije.',
  },
];

export default function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: '', email: '' });
  const [errors, setErrors] = useState({ question: '', email: '' });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ question: '', email: '' });
    setSubmissionStatus(null);

    let hasErrors = false;
    if (!formData.question.trim()) {
      setErrors(prevState => ({ ...prevState, question: 'Molimo unesite Vaše pitanje.' }));
      hasErrors = true;
    }
    if (!formData.email.trim()) {
      setErrors(prevState => ({ ...prevState, email: 'Molimo unesite Vaš mail.' }));
      hasErrors = true;
    }

    if (!hasErrors) {
      console.log('Forma je poslana:', formData);
      setSubmissionStatus('success');
      setFormData({ question: '', email: '' });
    }
  };

  const handleSendNewQuestion = () => {
    setSubmissionStatus(null);
  };

  return (
    <div className={styles.helpPage}>
      <h1 className={styles.pageHeader}>Pomoć i podrška</h1>
      
      <div className={styles.faqSection}>
        <div className={styles.faqSectionTitle}>Česta pitanja</div>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <div className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
              {faq.question}
              <span className={`${styles.arrowIcon} ${openFaqIndex === index ? styles.rotate : ''}`}>&#9660;</span>
            </div>
            <div className={`${styles.faqAnswer} ${openFaqIndex === index ? styles.show : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.supportSection}>
        <div className={styles.supportTitle}>Trebate dodatnu pomoć?</div>
        {submissionStatus === 'success' ? (
          <div className={styles.successMessage}>
            <p>Vaše pitanje je uspješno poslano!</p>
            <p>Odgovor možete očekivati na svom mailu u najkraćem mogućem roku.</p>
            <button onClick={handleSendNewQuestion} className={styles.sendNewButton}>
              Pošalji novo pitanje
            </button>
          </div>
        ) : (
          <form className={styles.supportForm} onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label htmlFor="question">S čime Vam možemo pomoći:</label>
              <textarea 
                id="question" 
                placeholder="Unesite Vaše pitanje ovdje" 
                value={formData.question}
                onChange={handleChange}
              ></textarea>
              {errors.question && <p className={styles.errorMessage}>{errors.question}</p>}
            </div>
            <div className={styles.formField}>
              <label htmlFor="email">Vaš mail:</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Unesite Vaš mail ovdje" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
            </div>
            <button type="submit" className={styles.submitButton}>Pošalji pitanje</button>
          </form>
        )}
      </div>
    </div>
  );
}