import React, {useEffect, useState} from 'react'
import FAQSection from '../Components/FAQSection';

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";
const Faq = () => {
    const [faqs, setFaqs] = useState([]);
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/faq`); 
        const data = await res.json();
        if(data.success) {
          setFaqs(data.listings);
        }
      } catch (err) {
        console.error("Error fetching FAQ data:", err);
      }
    };
    useEffect(()=> {
        fetchFaqs();
    }, []);
  return (
    <FAQSection faqs={faqs} showViewAll={false} />
  )
}

export default Faq