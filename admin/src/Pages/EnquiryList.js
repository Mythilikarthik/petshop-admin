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

import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Modal } from "react-bootstrap";
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

  // ✅ Fetch enquiries
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

  // ✅ GROUP BY name + email + shopName
  const groupedEnquiries = useMemo(() => {
    const grouped = {};

    enquiries.forEach((enq) => {
      const shopName = enq.listingId?.shopName || "N/A";

      const key = `${enq.userName}_${enq.userEmail}_${shopName}`;

      if (!grouped[key]) {
        grouped[key] = {
          userName: enq.userName,
          userEmail: enq.userEmail,
          shopName: shopName,
          count: 1,
          enquiries: [enq],
          latestDate: enq.createdAt,
        };
      } else {
        grouped[key].count += 1;
        grouped[key].enquiries.push(enq);

        // update latest date
        if (
          new Date(enq.createdAt) >
          new Date(grouped[key].latestDate)
        ) {
          grouped[key].latestDate = enq.createdAt;
        }
      }
    });

    return Object.values(grouped);
  }, [enquiries]);

  // ✅ Pagination based on grouped data
  const pageCount = Math.ceil(groupedEnquiries.length / itemsPerPage);

  const displayedEnquiries = groupedEnquiries.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ✅ Delete entire group
  const handleDeleteGroup = async (group) => {
    if (!window.confirm("Delete all enquiries for this user & shop?"))
      return;

    try {
      for (let enq of group.enquiries) {
        await fetch(`${API_BASE}/api/enquiry/${enq._id}`, {
          method: "DELETE",
        });
      }

      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
        <div className="pl-3 pr-3">
      <h3>Grouped Enquiry List</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Listing</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Enquiries</th>
            <th>Latest Date</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          {displayedEnquiries.map((group, index) => (
            <tr key={`${group.userEmail}-${group.shopName}`}>
              <td>{currentPage * itemsPerPage + index + 1}</td>
              <td>{group.shopName}</td>
              <td>{group.userName}</td>
              <td>{group.userEmail}</td>
              <td>
                <strong>{group.count}</strong>
              </td>
              <td>
                {new Date(group.latestDate).toLocaleString()}
              </td>
              <td>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedGroup(group);
                    setShowModal(true);
                  }}
                >
                  View All
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteGroup(group)}
                >
                  Delete All
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      {pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
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
        />
      )}

      {/* View All Enquiries Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            All Enquiries ({selectedGroup?.count})
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedGroup &&
            selectedGroup.enquiries.map((enq, index) => (
              <div key={enq._id} className="mb-3 border-bottom pb-2">
                <p><strong>Action:</strong> {enq.action}</p>
                <p><strong>IP:</strong> {enq.ip}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(enq.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

export default EnquiryList;