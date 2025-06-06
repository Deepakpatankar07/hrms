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
  }, []); 

  useEffect(() => {
    const checkAuth = () => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    };

    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting login with email:", email);
      
      const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password
      });
      console.log("Login successful:", response.data);
      const { token: newToken } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      
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