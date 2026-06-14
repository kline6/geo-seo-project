import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout.css";

function Layout({ user, onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={onLogout} />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;