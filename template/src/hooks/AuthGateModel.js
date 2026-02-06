import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

// import your components

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

// const AuthGateModal = ({ show, onClose }) => {
//   const [mode, setMode] = useState("login"); // login | signup

//   return (
//     <Modal show={show} onHide={onClose} centered backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {mode === "login" ? "Welcome back 👋" : "Create your account 🚀"}
//         </Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         {/* Google login */}
        

//         <hr />

//         {mode === "login" ? (
//           <LoginForm onSuccess={onClose} />
//         ) : (
//           <SignupForm onSuccess={onClose} />
//         )}

//         <div className="text-center mt-3">
//           {mode === "login" ? (
//             <span>
//               New here?{" "}
//               <Button
//                 variant="link"
//                 className="p-0"
//                 onClick={() => setMode("signup")}
//               >
//                 Sign up
//               </Button>
//             </span>
//           ) : (
//             <span>
//               Already have an account?{" "}
//               <Button
//                 variant="link"
//                 className="p-0"
//                 onClick={() => setMode("login")}
//               >
//                 Login
//               </Button>
//             </span>
//           )}
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };
import { useEffect } from "react";
const AuthGateModal = ({ show, onClose, defaultMode = "login" }) => {
  const [mode, setMode] = useState(defaultMode);
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "login" ? "Login to continue" : "Create an account"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {mode === "login" ? (
          <>
            <LoginForm onSuccess={onClose} />
            <p className="text-center mt-3">
              No account?{" "}
              <Button variant="link" onClick={() => setMode("signup")}>
                Sign up
              </Button>
            </p>
          </>
        ) : (
          <>
            <SignupForm onSuccess={onClose} />
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Button variant="link" onClick={() => setMode("login")}>
                Login
              </Button>
            </p>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};


export default AuthGateModal;
