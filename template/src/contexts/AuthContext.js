// import { createContext, useContext, useState } from "react";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     localStorage.getItem("user")
//       ? JSON.parse(localStorage.getItem("user"))
//       : null
//   );

//   const loginWithGoogle = (credentialResponse) => {
//     const decoded = jwtDecode(credentialResponse.credential);

//     const userData = {
//       name: decoded.name,
//       email: decoded.email,
//       picture: decoded.picture,
//     };

//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);

//     // OPTIONAL: send to backend
//     fetch("http://localhost:5000/api/auth/google", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token: credentialResponse.credential }),
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const loginWithGoogle = async (googleToken) => {
    const res = await fetch(`${API_BASE}/api/auth/site/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: googleToken }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Google login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return true;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false); // ✅ auth hydrated
  }, []);
  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
