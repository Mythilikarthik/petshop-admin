// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import excelFile from '../assets/content.xlsx';

// export default function ExcelReader() {
//   const [pages, setPages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);

//   useEffect(() => {
//     // Fetch the file directly from the public directory
//     fetch(excelFile)
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => {
//         const workbook = XLSX.read(buffer, { type: 'buffer' });
        
//         // Option A: If each sheet in Excel is a page
//         // Option B: If sheet 1 contains 50 rows (where each row is a page)
//         const firstSheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[firstSheetName];
//         const rows = XLSX.utils.sheet_to_json(sheet);
        
//         setPages(rows);
//       });
//   }, []);

//   if (pages.length === 0) return <div>Loading Excel file...</div>;

//   return (
//     <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
//       {/* Page Content */}
//       <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
//         <h2>{pages[currentPage].Title || `Page ${currentPage + 1}`}</h2>
//         <p>{pages[currentPage].Content}</p>
//       </div>

//       {/* Navigation Controls */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
//         <button 
//           disabled={currentPage === 0} 
//           onClick={() => setCurrentPage((p) => p - 1)}
//         >
//           Previous
//         </button>

//         <span>Page {currentPage + 1} of {pages.length}</span>

//         <button 
//           disabled={currentPage === pages.length - 1} 
//           onClick={() => setCurrentPage((p) => p + 1)}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import excelFile from '../assets/content.xlsx'; // Make sure your file path is correct

// export default function ExcelReader() {
//   const [pages, setPages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { pageSlug } = useParams(); // Reads "page-1", "page-2", etc.
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(excelFile)
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => {
//         const workbook = XLSX.read(buffer, { type: 'buffer' });
//         const firstSheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[firstSheetName];
        
//         // Parse rows as raw arrays: [['Page 1'], ['Page 2'], ...]
//         const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
//         // Flatten and clean row data
//         const extractedPages = rawRows
//           .flat()
//           .filter(Boolean)
//           .map((item) => String(item).trim());

//         setPages(extractedPages);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error loading Excel file:', err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div style={{ padding: '20px' }}>Loading Excel document...</div>;
//   if (pages.length === 0) return <div style={{ padding: '20px' }}>No content found.</div>;

//   // Helper to turn page names into URL slugs (e.g. "Page 1" -> "page-1")
//   const createSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

//   // Find index of current page matching the URL slug
//   const currentIndex = pages.findIndex((page) => createSlug(page) === pageSlug?.toLowerCase());

//   // Default to first page if URL doesn't match
//   const activeIndex = currentIndex !== -1 ? currentIndex : 0;
//   const currentPageContent = pages[activeIndex];

//   // Navigate function for dropdown / buttons
//   const handlePageChange = (targetIndex) => {
//     const slug = createSlug(pages[targetIndex]);
//     navigate(`/document-viewer/${slug}`);
//   };

//   return (
//     <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
//       {/* Page Content Display */}
//       <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '30px', minHeight: '300px' }}>
//         <h1 style={{ marginTop: 0 }}>{currentPageContent}</h1>
//         <p>This is the content for {currentPageContent}.</p>
//       </div>

//       {/* Navigation Controls */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        
//         {/* Previous Button */}
//         <button
//           disabled={activeIndex === 0}
//           onClick={() => handlePageChange(activeIndex - 1)}
//           style={{ padding: '8px 16px', cursor: activeIndex === 0 ? 'not-allowed' : 'pointer' }}
//         >
//           Previous
//         </button>

//         {/* Page Dropdown List */}
//         <select
//           value={createSlug(pages[activeIndex])}
//           onChange={(e) => navigate(`/document-viewer/${e.target.value}`)}
//           style={{ padding: '8px 12px', borderRadius: '4px' }}
//         >
//           {pages.map((pageTitle) => {
//             const slug = createSlug(pageTitle);
//             return (
//               <option key={slug} value={slug}>
//                 {pageTitle}
//               </option>
//             );
//           })}
//         </select>

//         {/* Next Button */}
//         <button
//           disabled={activeIndex === pages.length - 1}
//           onClick={() => handlePageChange(activeIndex + 1)}
//           style={{ padding: '8px 16px', cursor: activeIndex === pages.length - 1 ? 'not-allowed' : 'pointer' }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Card, Badge, Spinner, Breadcrumb } from 'react-bootstrap';
import excelFile from '../assets/content.xlsx';

export default function PetGroomingCityPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Route: /pet-grooming/:cityName
  const { cityName } = useParams();

  useEffect(() => {
    fetch(excelFile)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];

        const parsedRows = XLSX.utils.sheet_to_json(sheet);
        setData(parsedRows);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Excel file:', err);
        setLoading(false);
      });
  }, []);

  const createSlug = (text) => (text ? String(text).toLowerCase().trim().replace(/\s+/g, '-') : '');

  const currentCityData = data.find(
    (row) => createSlug(row.City) === createSlug(cityName)
  );

  // Dynamic Meta Title & Meta Description Setup
  useEffect(() => {
    if (currentCityData) {
      if (currentCityData.Meta_title) {
        document.title = currentCityData.Meta_title;
      }

      if (currentCityData.Meta_desc) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', currentCityData.Meta_desc);
      }
    }
  }, [currentCityData]);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" style={{ color: '#ff4e00' }} />
        <p className="mt-3 fw-semibold">Loading city details...</p>
      </Container>
    );
  }

  if (!currentCityData) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 border-0 shadow-sm rounded-4">
          <h2 className="fw-bold text-dark">City Not Found</h2>
          <p className="mb-0">We couldn't find any pet grooming data for "{cityName}".</p>
        </Card>
      </Container>
    );
  }

  const formatDirectoryListings = (htmlContent) => {
    if (!htmlContent) return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const h2Tag = doc.querySelector('h2');
    
    if (h2Tag) {
      const originalCity = h2Tag.textContent.trim();
      h2Tag.textContent = `Featured service providers - ${originalCity}`;
    }
    
    return doc.body.innerHTML;
  };
  // Place this helper function outside or above your component
const renderFormattedContent = (content) => {
  if (!content) return { __html: '' };

  let htmlContent = String(content);

  // Regex to detect Markdown table patterns (| col1 | col2 |)
  const markdownTableRegex = /\|(.+)\|[\r\n]+\|[-:| ]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;

  htmlContent = htmlContent.replace(markdownTableRegex, (match, headerRow, bodyRows) => {
    // Parse headers
    const headers = headerRow
      .split('|')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const ths = headers.map((h) => `<th>${h}</th>`).join('');

    // Parse rows
    const rows = bodyRows
      .trim()
      .split('\n')
      .map((row) => {
        const cells = row
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);

        if (cells.length === 0) return '';
        const tds = cells.map((c) => `<td>${c}</td>`).join('');
        return `<tr>${tds}</tr>`;
      })
      .join('');

    return `
      <div className="table-responsive">
        <table>
          <thead><tr>${ths}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  });

  return { __html: htmlContent };
};

  return (
    <div style={{ backgroundColor: '#fdfbfb', minHeight: '100vh', padding: '40px 0' }}>
      {/* Modern Custom Scoped Styles */}
      <style>{`
      .custom-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
          color: #9ca3af;
        }
        .custom-breadcrumb a {
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .custom-breadcrumb a:hover {
          color: #ff4e00;
        }
        .custom-breadcrumb .breadcrumb-item.active {
          color: #ff4e00;
          font-weight: 600;
        }

        /* Card Hover & Styling */
        .custom-card {
          border-radius: 20px !important;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05) !important;
          position: relative;
          overflow: hidden;
        }
        .custom-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(255, 78, 0, 0.12) !important;
          border-color: rgba(255, 78, 0, 0.2) !important;
        }
        /* Card Hover & Styling */
        .custom-card {
          border-radius: 20px !important;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05) !important;
          position: relative;
          overflow: hidden;
        }
        .custom-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(255, 78, 0, 0.12) !important;
          border-color: rgba(255, 78, 0, 0.2) !important;
        }
        
        /* Excel HTML Elements Custom Styling */
        .excel-content h2 {
          color: #111827;
          font-size: 1.3rem;
          font-weight: 800;
          margin-top: 0;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .excel-content h2::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 1.2rem;
          background: #ff4e00;
          border-radius: 4px;
        }
        .excel-content h3 {
          color: #111827;
          font-size: 1.05rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          background: #fff5f0;
          padding: 8px 14px;
          border-radius: 8px;
          border-left: 3px solid #ff4e00;
        }
        .excel-content ul {
          list-style: disclosure-closed;
          padding-left: 1rem;
          margin-bottom: 0;
        }
        .excel-content ul li {
          position: relative;
          // padding-left: 1.75rem;
          margin-bottom: 0.85rem;
          // color: #4b5563;
          line-height: 1.6;
        }
        // .excel-content ul li::before {
        //   content: '✓';
        //   position: absolute;
        //   left: 0;
        //   top: 2px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   width: 20px;
        //   height: 20px;
        //   background-color: #fff1eb;
        //   color: #ff4e00;
        //   font-size: 0.75rem;
        //   font-weight: 900;
        //   border-radius: 50%;
        // }
        .excel-content p {
          // color: #4b5563;
          line-height: 1.7;
          margin-bottom: 1rem;
          text-align: justify;
          text-justify: distribute;
        }
        
        /* Table Design */
        .excel-content table {
          width: 100%;
          margin: 1rem 0 0 0;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #f3f4f6;
        }
        .excel-content th {
          background-color: #fff5f0;
          color: #ff4e00;
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .excel-content td {
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
          background: #ffffff;
        }
        .excel-content tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      <Container>
        {/* Breadcrumb Navigation */}
        <Row className="mb-3">
          <Col lg={12}>
            <Breadcrumb className="custom-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pet-grooming' }}>
                Pet Grooming
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                {currentCityData.City || cityName}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        {/* Hero Section */}
        <Row className="mb-5">
          <Col lg={12}>
            <div 
              className="" 
              // style={{
              //   background: 'linear-gradient(180deg, #fff5f0 0%, #ffffff 100%)',
              //   border: '1px solid #ffe8df'
              // }}
            >
              <Badge 
                style={{ backgroundColor: '#ff4e00' }} 
                className="px-3 py-2 text-uppercase mb-3 rounded-pill fw-bold shadow-sm"
              >
                {currentCityData.City || 'Location'}
              </Badge>
              <h1 className="fw-extrabold text-dark mb-3 display-6" style={{ fontWeight: 800 }}>
                {currentCityData.H1}
              </h1>
              <p className="text-justify">
                {currentCityData.Intro}
              </p>
            </div>
          </Col>
        </Row>

        {/* Content Cards Grid */}
        <Row className="g-4">
          {/* {currentCityData['Directoty Listings'] && (
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="custom-card w-100 p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData['Directoty Listings'] }}
                />
              </Card>
            </Col>
          )} */}
          {currentCityData['Directoty Listings'] && (
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="custom-card w-100 p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ 
                    __html: formatDirectoryListings(currentCityData['Directoty Listings']) 
                  }}
                />
              </Card>
            </Col>
          )}

          {/* {currentCityData['Average Pricing'] && (
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="custom-card w-100 p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData['Average Pricing'] }}
                />
              </Card>
            </Col>
          )} */}

          {currentCityData['Average Pricing'] && (
  <Col md={6} className="d-flex align-items-stretch">
    <Card className="custom-card w-100 p-4">
      <Card.Body 
        className="excel-content p-0"
        dangerouslySetInnerHTML={renderFormattedContent(currentCityData['Average Pricing'])}
      />
    </Card>
  </Col>
)}

          {currentCityData['Services Offered'] && (
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="custom-card w-100 p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData['Services Offered'] }}
                />
              </Card>
            </Col>
          )}

          {currentCityData['How to Choose'] && (
            <Col md={6} className="d-flex align-items-stretch">
              <Card className="custom-card w-100 p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData['How to Choose'] }}
                />
              </Card>
            </Col>
          )}

          {currentCityData['Home Grooming'] && (
            <Col md={12} className="d-flex align-items-stretch">
              <Card className="custom-card p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData['Home Grooming'] }}
                />
              </Card>
            </Col>
          )}

          {currentCityData.FAQ && (
            <Col md={12}>
              <Card className="custom-card p-4">
                <Card.Body 
                  className="excel-content p-0"
                  dangerouslySetInnerHTML={{ __html: currentCityData.FAQ }}
                />
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}