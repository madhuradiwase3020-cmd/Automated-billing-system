import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useNavigate } from "react-router-dom";
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
  Plus,
} from "lucide-react";

import "./App.css";

import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";

const API = "http://localhost:4000/api";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("autobill_token");
    localStorage.removeItem("autobill_user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Receipt size={25} />
        </div>
        <div>
          <h2>AutoBill</h2>
          <span>Billing System</span>
        </div>
      </div>

      <nav className="menu">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
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
        <NavLink to="/settings" className={({ isActive }) => `sidebar-btn ${isActive ? "active" : ""}`}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <button type="button" className="sidebar-btn logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function AppShell({ children }) {
  const storedUser = localStorage.getItem("autobill_user");
  const user = React.useMemo(() => {
    try {
      return JSON.parse(storedUser || '{"name":"Madhura Diwase","role":"Administrator"}');
    } catch {
      return { name: "Madhura Diwase", role: "Administrator" };
    }
  }, [storedUser]);

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <div>
            <h1>AutoBill</h1>
            <p>Automated Billing System</p>
          </div>

          <div className="profile">
            <div className="avatar">{(user.name || "A").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user.name || "Madhura Diwase"}</strong>
              <span>{user.role || "Administrator"}</span>
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalBills: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = React.useState(true);

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API}/reports/dashboard`);
      const data = await response.json();
      if (data.success) {
        setStats(data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <section className="dashboard-content">
      <section className="stats">
        <div className="card">
          <div className="card-icon purple"><Package size={25} /></div>
          <div>
            <span>Total Products</span>
            <h2>{loading ? "..." : stats.totalProducts}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon blue"><Users size={25} /></div>
          <div>
            <span>Total Customers</span>
            <h2>{loading ? "..." : stats.totalCustomers}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon green"><Receipt size={25} /></div>
          <div>
            <span>Total Bills</span>
            <h2>{loading ? "..." : stats.totalBills}</h2>
          </div>
        </div>

        <div className="card">
          <div className="card-icon orange"><CreditCard size={25} /></div>
          <div>
            <span>Total Revenue</span>
            <h2>₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}</h2>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Billing System</h2>
              <p>Create and manage customer bills</p>
            </div>
            <Link to="/billing" className="view-btn">Open Billing</Link>
          </div>

          <div className="empty-state">
            <Receipt size={42} />
            <p>Create a new bill from your products and customers.</p>
            <Link to="/billing" className="create-btn">
              <Plus size={17} />
              Create Bill
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Inventory Status</h2>
              <p>Current stock alerts</p>
            </div>
            <Link to="/inventory" className="view-btn">View Inventory</Link>
          </div>

          <div className="inventory-item">
            <div>
              <strong>Low Stock Products</strong>
              <span>Products below stock limit</span>
            </div>
            <div className="stock">
              <strong>{stats.lowStockProducts || 0}</strong>
              <span>Products</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/products"><Package size={30} /><span>Add Product</span></Link>
          <Link to="/customers"><Users size={30} /><span>Add Customer</span></Link>
          <Link to="/billing"><Receipt size={30} /><span>Create Bill</span></Link>
          <Link to="/invoices"><FileText size={30} /><span>View Invoices</span></Link>
        </div>
      </section>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
        <Route path="/products" element={<AppShell><Products /></AppShell>} />
        <Route path="/customers" element={<AppShell><Customers /></AppShell>} />
        <Route path="/billing" element={<AppShell><Billing /></AppShell>} />
        <Route path="/invoices" element={<AppShell><Invoices /></AppShell>} />
        <Route path="/payments" element={<AppShell><Payments /></AppShell>} />
        <Route path="/inventory" element={<AppShell><Inventory /></AppShell>} />
        <Route path="/reports" element={<AppShell><Reports /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;