import React, { useState } from 'react';
import './Css/FAQSection.css';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: "How do I list my pet business on PetPals India?",
    answer: "To list your pet business, create an account and click on 'Add Listing' from your dashboard. Fill in your business details, upload photos, select relevant categories, and submit for review. Our team will verify your information and publish your listing within 24-48 hours."
  },
  {
    question: "Is PetPals India available in all Indian cities?",
    answer: "Yes, PetPals India is available across all major cities in India. We have extensive listings in metropolitan areas like Mumbai, Delhi, Bangalore, Chennai, and Hyderabad, and we're continuously expanding our coverage to smaller cities and towns throughout the country."
  },
  {
    question: "How can I find emergency veterinary services?",
    answer: "For emergency veterinary services, use our search filter to select '24/7 Emergency' or 'Emergency Services' under the category options. You can also click on the 'Emergency' quick link on our homepage to see all available emergency pet care providers in your area."
  },
  {
    question: "Are the reviews on PetPals India verified?",
    answer: "Yes, all reviews on PetPals India are from verified users who have registered accounts. We have a moderation system in place to ensure reviews are authentic and follow our community guidelines. Business owners can also respond to reviews to address any concerns."
  },
  {
    question: "How do I report an issue with a listing?",
    answer: "If you encounter any issues with a listing, click on the 'Report' button on the listing page. Fill out the form with details about the issue, and our moderation team will review it promptly. You can also contact our support team directly through the 'Contact Us' page for urgent matters."
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