import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  FileText,
  CreditCard,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("autobill_user") || '{"name":"Admin","role":"Administrator"}');

  const handleLogout = () => {
    localStorage.removeItem("autobill_user");
    localStorage.removeItem("autobill_token");
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const getPageMeta = () => {
    const path = location.pathname;
    if (path === "/" || path === "") return { title: "Dashboard", desc: "Welcome to Automated Billing System" };
    if (path.startsWith("/products")) return { title: "Products Management", desc: "Manage catalog, pricing, tax rates and stock" };
    if (path.startsWith("/customers")) return { title: "Customers Directory", desc: "Manage client database, contact information and history" };
    if (path.startsWith("/billing")) return { title: "Billing & Point of Sale", desc: "Create new invoices, calculate GST and checkout quickly" };
    if (path.startsWith("/invoices")) return { title: "Invoices & Bills", desc: "View, download PDF receipts and track billing records" };
    if (path.startsWith("/payments")) return { title: "Payment Transactions", desc: "Track cash, UPI, card payments and settle outstanding balances" };
    if (path.startsWith("/inventory")) return { title: "Inventory & Stock", desc: "Monitor stock quantities, reorder points and inventory valuation" };
    if (path.startsWith("/reports")) return { title: "Reports & Analytics", desc: "Sales performance, revenue breakdowns and transaction logs" };
    if (path.startsWith("/settings")) return { title: "System & Store Settings", desc: "Configure store details, tax preferences and profile" };
    return { title: "AutoBill", desc: "Automated Billing System" };
  };

  const meta = getPageMeta();

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="logo-icon"><LayoutDashboard size={20} /></div>
          <div>
            <h2>AutoBill</h2>
            <span>Billing System</span>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")}>
            <Package size={19} />
            <span>Products</span>
          </NavLink>

          <NavLink to="/customers" className={({ isActive }) => (isActive ? "active" : "")}>
            <Users size={19} />
            <span>Customers</span>
          </NavLink>

          <NavLink to="/billing" className={({ isActive }) => (isActive ? "active" : "")}>
            <Receipt size={19} />
            <span>Billing</span>
          </NavLink>

          <NavLink to="/invoices" className={({ isActive }) => (isActive ? "active" : "")}>
            <FileText size={19} />
            <span>Invoices</span>
          </NavLink>

          <NavLink to="/payments" className={({ isActive }) => (isActive ? "active" : "")}>
            <CreditCard size={19} />
            <span>Payments</span>
          </NavLink>

          <NavLink to="/inventory" className={({ isActive }) => (isActive ? "active" : "")}>
            <Boxes size={19} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
            <BarChart3 size={19} />
            <span>Reports</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active-settings-btn" : "sidebar-btn")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button className="logout sidebar-btn" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{meta.title}</h1>
            <p>{meta.desc}</p>
          </div>

          <div className="profile" onClick={() => navigate("/settings")} style={{ cursor: "pointer" }}>
            <div className="avatar">{(user.name && user.name[0]) ? user.name[0].toUpperCase() : "A"}</div>
            <div>
              <strong>{user.name || "Admin"}</strong>
              <span>{user.role || "Administrator"}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </main>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content mini-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of AutoBill?</p>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button className="secondary-btn" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
