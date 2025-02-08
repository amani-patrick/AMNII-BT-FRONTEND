import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to access the authentication context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  const handleError = (error) => {
    if (error.response) {

      setError(error.response.data.detail || "An error occurred. Please try again.");
    } else if (error.request) {
      setError("No response received from the server. Please try again later.");
    } else {
      setError("An unexpected error occurred.");
    }
  };

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, handleError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
