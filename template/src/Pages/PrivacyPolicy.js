import React, { useEffect, useState } from 'react'
import { Image, Container } from 'react-bootstrap';
import DOMPurify from "dompurify";
import { HeadProvider, Title, Meta } from "react-head";

const API_BASE = process.env.NODE_ENV === "production" 
? process.env.REACT_APP_API_URL
: "http://localhost:5000";

const PrivacyPolicy = () => {
  const pagename = "privacy-policy";
  const [petHealth, setPetHealth] = useState({});
  const fetchPetHealth = async()  => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-page/slug/${pagename}`, {
        method: "GET", 
        headers: {
          "Content-type" : "application/json",
        },
      })
      const data = await res.json();
      if(data.success) {
        console.log(data.page);
        setPetHealth(data.page);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
  useEffect(() => {
    fetchPetHealth();
  }, [])
    const safeHTML = DOMPurify.sanitize(petHealth?.content || "");
  return (    
    <>
    {petHealth?.banner && (
          <Image
            className='img-responsive'
            src={`${API_BASE}/${petHealth.banner}`}
            alt="Banner"
            style={{ width: "100%", height: "450px", objectFit: "cover" }}
          />
        )}
    <section className='pet-health mt-5 mb-5'>
      <HeadProvider>
      <div>
        <Title>{petHealth?.metaTitle || "Page"}</Title>
        <Meta name="description" content={petHealth?.metaDescription || ""} />
        <Meta
          name="keywords"
          content={petHealth?.metaKeyword?.join(", ") || ""}
        />
      </div>
    </HeadProvider>
      <Container>
        <h2>{petHealth.pageTitle}</h2>
        <div className='content'>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          ></div>
        </div>
      </Container>
    </section>
    </>
  )
}

export default PrivacyPolicy