import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileWidget from "./components/ProfileSidebar";
import './Layout.css';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto p-6 bg-gray-100">
        <Outlet />  {/* This will render the child components */}
      </div>

      {/* Profile Sidebar - Fixed on the right */}
      <ProfileWidget />
    </div>
  );
};

export default Layout;
