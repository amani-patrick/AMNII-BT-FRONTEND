import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import { HomeIcon, ChartBarIcon, Cog6ToothIcon, DocumentTextIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-6">AMNII-BT</h2>
        <nav className="space-y-2">
          <NavItem to="/" icon={HomeIcon} text="Home" />
          <NavItem to="/markets" icon={ChartBarIcon} text="Markets" />
          <NavItem to="/reports" icon={DocumentTextIcon} text="Reports" />
          <NavItem to="/settings" icon={Cog6ToothIcon} text="Settings" />
          <NavItem to="/accounts" icon={UserCircleIcon} text="Accounts" /> {/* New Accounts link */}
        </nav>
      </div>
      <button className="bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-500 transition">
        About
      </button>
    </div>
  );
}

// Navigation Item Component
const NavItem = ({ to, icon: Icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2 rounded transition ${
        isActive ? "bg-gray-700 text-green-400" : "hover:bg-gray-700"
      }`
    }
  >
    <Icon className="w-6 h-6" />
    <span>{text}</span>
  </NavLink>
);

// Prop validation for NavItem
NavItem.propTypes = {
  to: PropTypes.string.isRequired, // Ensures the link has a valid path
  icon: PropTypes.elementType.isRequired, // Ensures the icon is a valid React component
  text: PropTypes.string.isRequired, // Ensures the text is a string
};
