import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/util/AuthProvider.jsx";  // Import the custom hook
import Layout from "./Layout";
import Home from "./components/pages/Home";
import Market from "./components/pages/Market";
import Reports from "./components/pages/Reports";
import Settings from "./components/pages/Settings";
import Account from "./components/pages/Account";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import propTypes from "prop-types";

function PrivateRoute({ element }) {
  const { isAuthenticated } = useAuth(); // Access authentication status
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PrivateRoute element={<Home />} />} />
          <Route path="markets" element={<PrivateRoute element={<Market />} />} />
          <Route path="reports" element={<PrivateRoute element={<Reports />} />} />
          <Route path="settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="accounts" element={<PrivateRoute element={<Account />} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

PrivateRoute.propTypes = {
  element: propTypes.node.isRequired,
};

export default App;
