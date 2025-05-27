// // src/context/AuthContext.js
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(true);

//   // Fetch user data when token changes
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         if (token) {
//           const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });
//           setUser(response.data.data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user data", err);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [token]);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check token expiration
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error("Token decoding error:", err);
      return true;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          if (isTokenExpired(token)) {
            await logout();
            return;
          }

          // Fetch user data
          const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.data);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array to run only once on mount

  // Auto-logout when token expires
  useEffect(() => {
    const checkAuth = () => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password
      });
      
      const { token: newToken } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      
      // Fetch user data after login
      const userResponse = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${newToken}`
        }
      });
      setUser(userResponse.data.data);
      
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.get("http://localhost:5000/api/v1/auth/logout", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setError(null);
      navigate("/login");
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !isTokenExpired(token),
    login,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};