// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import ReactPaginate from "react-paginate";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? "https://petshop-admin.onrender.com"
//     : "http://localhost:5000";

// const itemsPerPage = 10;

// const EnquiryList = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);

//   // ✅ Fetch enquiries
//   const fetchEnquiries = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/enquiry`);
//       const data = await res.json();

//       setEnquiries(Array.isArray(data) ? data : []);
//       setCurrentPage(0); // reset page
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   // ✅ Pagination logic
//   const pageCount = Math.ceil(enquiries.length / itemsPerPage);

//   const displayedEnquiries = enquiries.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   // ✅ View Enquiry
//   const handleView = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/enquiry/${id}`);
//       const data = await res.json();
//       setSelected(data);
//       setShowModal(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Delete Enquiry
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this enquiry?"))
//       return;

//     try {
//       await fetch(`${API_BASE}/api/enquiry/${id}`, {
//         method: "DELETE",
//       });

//       fetchEnquiries();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Enquiry List</h3>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Listing</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Action</th>
//             <th>Date</th>
//             <th>Options</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedEnquiries.map((enq, index) => (
//             <tr key={enq._id}>
//               <td>{currentPage * itemsPerPage + index + 1}</td>
//               <td>{enq.listingId?.shopName}</td>
//               <td>{enq.userName}</td>
//               <td>{enq.userEmail}</td>
//               <td>{enq.action}</td>
//               <td>{new Date(enq.createdAt).toLocaleString()}</td>
//               <td>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => handleView(enq._id)}
//                   className="me-2"
//                 >
//                   View
//                 </Button>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDelete(enq._id)}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//       {pageCount > 1 && (
//         <ReactPaginate
//           pageCount={pageCount}
//           pageRangeDisplayed={2}
//           marginPagesDisplayed={1}
//           onPageChange={handlePageClick}
//           containerClassName="pagination justify-content-center"
//           pageClassName="page-item"
//           pageLinkClassName="page-link"
//           previousLabel="«"
//           nextLabel="»"
//           previousClassName="page-item"
//           nextClassName="page-item"
//           previousLinkClassName="page-link"
//           nextLinkClassName="page-link"
//           activeClassName="active"
//         />
//       )}

//       {/* View Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Enquiry Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selected && (
//             <>
//               <p><strong>Listing:</strong> {selected.listingId?.shopName}</p>
//               <p><strong>Name:</strong> {selected.userName}</p>
//               <p><strong>Email:</strong> {selected.userEmail}</p>
//               <p><strong>Action:</strong> {selected.action}</p>
//               <p><strong>IP:</strong> {selected.ip}</p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(selected.createdAt).toLocaleString()}
//               </p>
//             </>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default EnquiryList;

// import React, { useEffect, useState, useMemo } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import ReactPaginate from "react-paginate";

// const API_BASE =
//   process.env.NODE_ENV === "production"
//     ? "https://petshop-admin.onrender.com"
//     : "http://localhost:5000";

// const itemsPerPage = 10;

// const EnquiryList = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);

//   // ✅ Fetch enquiries
//   const fetchEnquiries = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/enquiry`);
//       const data = await res.json();

//       setEnquiries(Array.isArray(data) ? data : []);
//       setCurrentPage(0);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   // ✅ GROUP BY name + email + shopName
//   const groupedEnquiries = useMemo(() => {
//     const grouped = {};

//     enquiries.forEach((enq) => {
//       const shopName = enq.listingId?.shopName || "N/A";

//       const key = `${enq.userName}_${enq.userEmail}_${shopName}`;

//       if (!grouped[key]) {
//         grouped[key] = {
//           userName: enq.userName,
//           userEmail: enq.userEmail,
//           shopName: shopName,
//           count: 1,
//           enquiries: [enq],
//           latestDate: enq.createdAt,
//         };
//       } else {
//         grouped[key].count += 1;
//         grouped[key].enquiries.push(enq);

//         // update latest date
//         if (
//           new Date(enq.createdAt) >
//           new Date(grouped[key].latestDate)
//         ) {
//           grouped[key].latestDate = enq.createdAt;
//         }
//       }
//     });

//     return Object.values(grouped);
//   }, [enquiries]);

//   // ✅ Pagination based on grouped data
//   const pageCount = Math.ceil(groupedEnquiries.length / itemsPerPage);

//   const displayedEnquiries = groupedEnquiries.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   // ✅ Delete entire group
//   const handleDeleteGroup = async (group) => {
//     if (!window.confirm("Delete all enquiries for this user & shop?"))
//       return;

//     try {
//       for (let enq of group.enquiries) {
//         await fetch(`${API_BASE}/api/enquiry/${enq._id}`, {
//           method: "DELETE",
//         });
//       }

//       fetchEnquiries();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//         <div className="pl-3 pr-3">
//       <h3>Grouped Enquiry List</h3>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>S.No</th>
//             <th>Listing</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Total Enquiries</th>
//             <th>Latest Date</th>
//             <th>Options</th>
//           </tr>
//         </thead>

//         <tbody>
//           {displayedEnquiries.map((group, index) => (
//             <tr key={`${group.userEmail}-${group.shopName}`}>
//               <td>{currentPage * itemsPerPage + index + 1}</td>
//               <td>{group.shopName}</td>
//               <td>{group.userName}</td>
//               <td>{group.userEmail}</td>
//               <td>
//                 <strong>{group.count}</strong>
//               </td>
//               <td>
//                 {new Date(group.latestDate).toLocaleString()}
//               </td>
//               <td>
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   className="me-2"
//                   onClick={() => {
//                     setSelectedGroup(group);
//                     setShowModal(true);
//                   }}
//                 >
//                   View All
//                 </Button>

//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDeleteGroup(group)}
//                 >
//                   Delete All
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//       {pageCount > 1 && (
//         <ReactPaginate
//           pageCount={pageCount}
//           pageRangeDisplayed={2}
//           marginPagesDisplayed={1}
//           onPageChange={handlePageClick}
//           containerClassName="pagination justify-content-center"
//           pageClassName="page-item"
//           pageLinkClassName="page-link"
//           previousLabel="«"
//           nextLabel="»"
//           previousClassName="page-item"
//           nextClassName="page-item"
//           previousLinkClassName="page-link"
//           nextLinkClassName="page-link"
//           activeClassName="active"
//         />
//       )}

//       {/* View All Enquiries Modal */}
//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             All Enquiries ({selectedGroup?.count})
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {selectedGroup &&
//             selectedGroup.enquiries.map((enq, index) => (
//               <div key={enq._id} className="mb-3 border-bottom pb-2">
//                 <p><strong>Action:</strong> {enq.action}</p>
//                 <p><strong>IP:</strong> {enq.ip}</p>
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(enq.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//         </Modal.Body>
//       </Modal>
//     </div>
//     </div>
//   );
// };

// export default EnquiryList;
import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaArrowDown, FaArrowUp, FaSort } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://petshop-admin.onrender.com"
    : "http://localhost:5000";

const itemsPerPage = 10;

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortField, setSortField] = useState("latestDate");
const [sortOrder, setSortOrder] = useState("desc"); // asc | desc


  // 🔎 Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/enquiry`);
      const data = await res.json();
      setEnquiries(Array.isArray(data) ? data : []);
      setCurrentPage(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ✅ GROUP CLEANED
  const groupedEnquiries = useMemo(() => {
    const grouped = {};

    enquiries.forEach((enq) => {
      const shopNameRaw = enq.listingId?.shopName || "N/A";

      const userName = enq.userName?.trim().toLowerCase() || "";
      const userEmail = enq.userEmail?.trim().toLowerCase() || "";
      const shopName = shopNameRaw?.trim().toLowerCase() || "";

      const key = `${userName}_${userEmail}_${shopName}`;

      if (!grouped[key]) {
        grouped[key] = {
          userName: enq.userName?.trim() || "N/A",
          userEmail: enq.userEmail?.trim() || "N/A",
          shopName: shopNameRaw?.trim() || "N/A",
          count: 1,
          enquiries: [enq],
          latestDate: enq.createdAt,
        };
      } else {
        grouped[key].count += 1;
        grouped[key].enquiries.push(enq);

        if (new Date(enq.createdAt) > new Date(grouped[key].latestDate)) {
          grouped[key].latestDate = enq.createdAt;
        }
      }
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(b.latestDate) - new Date(a.latestDate)
    );
  }, [enquiries]);

  // ✅ FILTER LOGIC
  const filteredGroups = useMemo(() => {
    return groupedEnquiries.filter((group) => {
      const matchesSearch =
        group.userName.toLowerCase().includes(search.toLowerCase()) ||
        group.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        group.shopName.toLowerCase().includes(search.toLowerCase());

      const groupDate = new Date(group.latestDate);

      const matchesFrom =
        !fromDate || groupDate >= new Date(fromDate + "T00:00:00");

      const matchesTo =
        !toDate || groupDate <= new Date(toDate + "T23:59:59");

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [groupedEnquiries, search, fromDate, toDate]);

  const sortedGroups = useMemo(() => {
  let sorted = [...filteredGroups];

  sorted.sort((a, b) => {
    let valA, valB;

    if (sortField === "count") {
      valA = a.count;
      valB = b.count;
    } else if (sortField === "latestDate") {
      valA = new Date(a.latestDate);
      valB = new Date(b.latestDate);
    } else {
      valA = a[sortField]?.toLowerCase?.() || "";
      valB = b[sortField]?.toLowerCase?.() || "";
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}, [filteredGroups, sortField, sortOrder]);
  const totalClicks = useMemo(() => {
    return filteredGroups.reduce((sum, group) => sum + group.count, 0);
  }, [filteredGroups]);

  // const pageCount = Math.ceil(filteredGroups.length / itemsPerPage);
  const pageCount = Math.ceil(sortedGroups.length / itemsPerPage);

  // const displayedEnquiries = filteredGroups.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );
  const displayedEnquiries = sortedGroups.slice(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage
);
const handleSort = (field) => {
  if (sortField === field) {
    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortField(field);
    setSortOrder("asc");
  }
};

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ✅ CSV EXPORT
  const exportCSV = () => {
    const headers = [
      "Listing",
      "Name",
      "Email",
      "Total Clicks",
      "Latest Date",
    ];

    const rows = filteredGroups.map((group) => [
      group.shopName,
      group.userName,
      group.userEmail,
      group.count,
      new Date(group.latestDate).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enquiries.csv");
    document.body.appendChild(link);
    link.click();
  };

  const markAsSeen = async (group) => {
  try {
    const ids = group.enquiries.map(e => e._id);

    await fetch(`${API_BASE}/api/enquiry/mark-seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ids })
    });

    // ✅ Update UI instantly
    setEnquiries(prev =>
      prev.map(e =>
        ids.includes(e._id) ? { ...e, isSeen: true } : e
      )
    );

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="container mt-4">
     <div className="pl-3 pr-3">
       <h3>Grouped Enquiry List</h3>

      {/* 🔎 FILTER BAR */}
      <Row className="mb-3">
        <Col md={12}>
        <div style={{ "position" : "relative"}}>
              
        <Form.Control
            type="text"
            placeholder="Search name, email, shopname"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
          />

              {search && (
              <span
                onClick={() => {
                  setSearch("");
                  setCurrentPage(0);
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#888"
                }}
              >
                ✕
              </span>
            )}
            </div>
          
        </Col>

        {/* <Col md={3}>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>

        <Col md={3}>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>

        <Col md={2}>
          <Button variant="success" onClick={exportCSV}>
            Export CSV
          </Button>
        </Col> */}
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Listing</th>
            <th>Name</th>
            <th>Email</th>
            <th onClick={() => handleSort("count")} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
  Total Clicks{" "}
  <span className="ms-1">
    {sortField === "count" ? (
      sortOrder === "asc" ? (
        <FaArrowUp />
      ) : (
        <FaArrowDown />
      )
    ) : (
      <FaSort className="text-muted" />
    )}
  </span>
</th>
            <th>Latest Date</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          {displayedEnquiries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No enquiries found
              </td>
            </tr>
          ) : (
            displayedEnquiries.map((group, index) => (
              <tr key={index}>
                <td>{currentPage * itemsPerPage + index + 1}</td>
                <td>{group.shopName}</td>
                <td>{group.userName}</td>
                <td>{group.userEmail}</td>
                {/* <td><strong>{group.count}</strong></td> */}
                <td>
                  <strong>{group.count}</strong>
                  {group.enquiries.some(e => !e.isSeen) && (
                    <span style={{ color: "red", marginLeft: "5px" }}>●</span>
                  )}
                </td>
                <td>{new Date(group.latestDate).toLocaleString()}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowModal(true);
                      markAsSeen(group); 
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="text-end">
              <strong>Total Clicks:</strong>
            </td>
            <td>
              <strong>{totalClicks}</strong>
            </td>
            <td colSpan="2"></td>
          </tr>
        </tfoot>
      </Table>

      {pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousLabel="«"
          nextLabel="»"
          
            previousClassName="page-item"
            nextClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage}
        />
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            All Enquiries ({selectedGroup?.count})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGroup &&
            selectedGroup.enquiries.map((enq) => (
              <div key={enq._id} className="mb-3 border-bottom pb-2">
                <p><strong>Action:</strong> {enq.action}</p>
                <p><strong>IP:</strong> {enq.ip}</p>
                <p><strong>Date:</strong> {new Date(enq.createdAt).toLocaleString()}</p>
              </div>
            ))}
        </Modal.Body>
      </Modal>
     </div>
    </div>
  );
};

export default EnquiryList;