'use client'; // This must be the very first line
import { useState } from 'react';
import styles from './pomoc-i-podrska.module.css';

const faqs = [
  {
    question: 'Neko često pitanje?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna. Aenean velit odio, elementum in tempus ut, vehicula eu diam. Pellentesque rhoncus aliquam mattis. Ut vulputate eros sed felis sodales nec vulputate justo hendrerit. Vivamus varius pretium ligula, a aliquam odio euismod sit amet. Quisque laoreet sem sit amet orci ullamcorper et ultrices metus viverra. Pellentesque arcu mauris, malesuada quis ornare accumsan, blandit sed diam.',
  },
  {
    question: 'Neko često pitanje?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui.',
  },
  {
    question: 'Neko često pitanje?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui.',
  },
];

export default function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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
        <form className={styles.supportForm}>
          <div className={styles.formField}>
            <label htmlFor="question">S čime Vam možemo pomoći:</label>
            <textarea id="question" placeholder="Type here"></textarea>
          </div>
          <div className={styles.formField}>
            <label htmlFor="email">Vaš mail:</label>
            <input type="email" id="email" placeholder="Type here" />
          </div>
          <button type="submit" className={styles.submitButton}>Pošalji pitanje</button>
        </form>
      </div>
    </div>
  );
}