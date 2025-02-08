import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/pages/Home";
import Market from "./components/pages/Market";
import Reports from "./components/pages/Reports";
import Settings from "./components/pages/Settings";
import Account from "./components/pages/Account";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import propTypes from "prop-types";

function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
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
