import React, { useState } from 'react';
import './Css/FAQSection.css';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: "How do I list my pet business on PetPals India?",
    answer: "Sign up for an account, then use the 'Add Listing' option in your dashboard to submit your business details."
  },
  {
    question: "Is PetPals India available in all Indian cities?",
    answer: "PetPals India is expanding rapidly and covers most major cities. Check our directory for the latest coverage."
  },
  {
    question: "How can I find emergency veterinary services?",
    answer: "Use the search and filter options in our directory to find 24/7 emergency veterinary services near you."
  },
  {
    question: "Are the reviews on PetPals India verified?",
    answer: "We moderate reviews for authenticity, but always recommend contacting businesses directly for confirmation."
  },
  {
    question: "How do I report an issue with a listing?",
    answer: "Click the 'Report' button on the listing page or contact our support team for assistance."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <div className="faq-title">
        <h2>
          Frequently Asked <span className="highlight">Questions</span>
        </h2>
        <p>Find answers to common questions about our pet directory</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div className="faq-card" key={idx}>
            <button className="faq-question" onClick={() => toggleFAQ(idx)}>
              {faq.question}
              <span className={`faq-icon${openIndex === idx ? ' open' : ''}`}>
                <FiChevronDown size={22} color="#ff9800" />
              </span>
            </button>
            {openIndex === idx && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="faq-footer">
        <button className="view-all-faq-btn">View All FAQs</button>
      </div>
    </section>
  );
};

export default FAQSection;