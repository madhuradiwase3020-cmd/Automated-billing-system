import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  Receipt,
  CreditCard,
  Plus,
  FileText,
} from "lucide-react";
import { API_BASE, formatCurrency, formatDate } from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalBills: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });
  const [recentBills, setRecentBills] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, billsRes, invRes] = await Promise.all([
        fetch(`${API_BASE}/reports/dashboard`),
        fetch(`${API_BASE}/billing`),
        fetch(`${API_BASE}/inventory`),
      ]);

      const dashData = await dashRes.json();
      if (dashData.success) {
        setStats(dashData.dashboard);
      }

      const billsData = await billsRes.json();
      if (billsData.success) {
        setRecentBills(billsData.bills.slice(0, 5));
      }

      const invData = await invRes.json();
      if (invData.success) {
        setInventoryList(invData.inventory.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend server. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      {error && <div className="error-banner">{error}</div>}

      <section className="stats">
        <div className="card" onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>
          <div className="card-icon purple"><Package size={25} /></div>
          <div>
            <span>Total Products</span>
            <h2>{loading ? "..." : stats.totalProducts}</h2>
          </div>
        </div>

        <div className="card" onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
          <div className="card-icon blue"><Users size={25} /></div>
          <div>
            <span>Total Customers</span>
            <h2>{loading ? "..." : stats.totalCustomers}</h2>
          </div>
        </div>

        <div className="card" onClick={() => navigate("/invoices")} style={{ cursor: "pointer" }}>
          <div className="card-icon green"><Receipt size={25} /></div>
          <div>
            <span>Total Bills</span>
            <h2>{loading ? "..." : stats.totalBills}</h2>
          </div>
        </div>

        <div className="card" onClick={() => navigate("/reports")} style={{ cursor: "pointer" }}>
          <div className="card-icon orange"><CreditCard size={25} /></div>
          <div>
            <span>Total Revenue</span>
            <h2>{loading ? "..." : formatCurrency(stats.totalRevenue)}</h2>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Bills</h2>
              <p>Latest billing transactions</p>
            </div>
            <button className="view-btn" onClick={() => navigate("/invoices")}>
              View All
            </button>
          </div>

          {recentBills.length === 0 ? (
            <div className="empty-state-box">
              <p>No bills generated yet.</p>
              <button className="primary-btn sm" onClick={() => navigate("/billing")}>
                Create First Bill
              </button>
            </div>
          ) : (
            recentBills.map((bill) => (
              <div key={bill._id} className="bill" onClick={() => navigate("/invoices")} style={{ cursor: "pointer" }}>
                <div className="bill-icon"><Receipt size={18} /></div>
                <div className="bill-info">
                  <strong>{bill.invoice_number}</strong>
                  <span>{bill.customer_id?.name || "Walk-in Customer"} • {formatDate(bill.createdAt)}</span>
                </div>
                <div className="bill-amount">
                  <strong>{formatCurrency(bill.grand_total)}</strong>
                  <span className={`status-tag ${bill.payment_status?.toLowerCase() || "pending"}`}>
                    {bill.payment_status || "Pending"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Inventory Status</h2>
              <p>Stock overview & alerts</p>
            </div>
            <button className="view-btn" onClick={() => navigate("/inventory")}>
              View All
            </button>
          </div>

          {inventoryList.length === 0 ? (
            <div className="empty-state-box">
              <p>No products in inventory.</p>
              <button className="primary-btn sm" onClick={() => navigate("/products")}>
                Add Products
              </button>
            </div>
          ) : (
            inventoryList.map((item) => {
              const isLowStock = item.stock_quantity <= item.low_stock_limit;
              const maxStockRef = Math.max(item.low_stock_limit * 3, 20);
              const percentage = Math.min(100, Math.round((item.stock_quantity / maxStockRef) * 100));

              return (
                <div key={item._id} className="inventory-card-item">
                  <div className="inventory-item">
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>{item.category}</span>
                    </div>
                    <div className="stock">
                      <strong style={{ color: isLowStock ? "#e63946" : "#21a366" }}>
                        {item.stock_quantity}
                      </strong>
                      <span>In Stock</span>
                    </div>
                  </div>
                  <div className="stock-progress">
                    <div
                      style={{
                        width: `${Math.max(percentage, 5)}%`,
                        background: isLowStock ? "#e63946" : "#21a366",
                      }}
                    ></div>
                  </div>
                  <div className="inventory-footer">
                    <span>Low stock limit: {item.low_stock_limit}</span>
                    <span className={isLowStock ? "stock-low" : "stock-good"}>
                      {isLowStock ? "Low Stock" : "Good Stock"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="quick-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button onClick={() => navigate("/products")}>
            <Plus size={24} />
            <span>Add Product</span>
          </button>

          <button onClick={() => navigate("/customers")}>
            <Users size={24} />
            <span>Add Customer</span>
          </button>

          <button onClick={() => navigate("/billing")}>
            <Receipt size={24} />
            <span>Create Bill</span>
          </button>

          <button onClick={() => navigate("/invoices")}>
            <FileText size={24} />
            <span>View Invoices</span>
          </button>
        </div>
      </section>
    </div>
  );
}
