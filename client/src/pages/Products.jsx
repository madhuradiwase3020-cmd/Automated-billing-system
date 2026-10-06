import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { API_BASE, formatCurrency } from "../utils/api";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    product_name: "",
    barcode: "",
    category: "General",
    price: "",
    gst_rate: 0,
    stock_quantity: 0,
    low_stock_limit: 5,
  };

  const [form, setForm] = useState(initialFormState);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch {
      setError("Backend server is not connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (searchParams.get("action") === "new") {
      setShowForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let result = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(term) ||
          (p.barcode && p.barcode.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term)
      );
    }
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, products]);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setForm({
      product_name: product.product_name,
      barcode: product.barcode || "",
      category: product.category || "General",
      price: product.price,
      gst_rate: product.gst_rate || 0,
      stock_quantity: product.stock_quantity || 0,
      low_stock_limit: product.low_stock_limit || 5,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`Product "${name}" deleted successfully.`);
        fetchProducts();
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      gst_rate: Number(form.gst_rate),
      stock_quantity: Number(form.stock_quantity),
      low_stock_limit: Number(form.low_stock_limit),
    };

    try {
      const url = editingProduct
        ? `${API_BASE}/products/${editingProduct._id}`
        : `${API_BASE}/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setShowForm(false);
        setEditingProduct(null);
        setForm(initialFormState);
        fetchProducts();
      } else {
        setError(data.message || "Failed to save product");
      }
    } catch {
      setError("Unable to connect to backend");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2>Product Catalog</h2>
          <p>Add, edit, track pricing and inventory stock levels</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingProduct(null);
            } else {
              setEditingProduct(null);
              setForm(initialFormState);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Close Form" : <><Plus size={16} /> Add Product</>}
        </button>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      {/* Add / Edit Form Panel */}
      {showForm && (
        <div className="form-panel card-shadow">
          <div className="panel-top-title">
            <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <button
              className="text-btn"
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Mouse"
                  required
                />
              </div>

              <div className="form-group">
                <label>Barcode / SKU</label>
                <input
                  type="text"
                  name="barcode"
                  value={form.barcode}
                  onChange={handleChange}
                  placeholder="e.g. 890123456789"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics, Stationary"
                />
              </div>

              <div className="form-group">
                <label>Selling Price *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className="form-group">
                <label>GST Rate (%)</label>
                <select name="gst_rate" value={form.gst_rate} onChange={handleChange}>
                  <option value={0}>0% (Exempt)</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18% (Standard)</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div className="form-group">
                <label>Initial Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Low Stock Limit Warning</label>
                <input
                  type="number"
                  name="low_stock_limit"
                  value={form.low_stock_limit}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="table-controls">
        <div className="search-box">
          <Search className="search-icon" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by product name, barcode, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              Clear
            </button>
          )}
        </div>

        <div className="filter-group">
          <label>Filter Category:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Panel */}
      <div className="data-panel">
        <div className="table-header">
          <h3>Products List</h3>
          <span>Showing {filteredProducts.length} of {products.length} products</span>
        </div>

        {loading ? (
          <div className="loading-box">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state-box">
            <p>No products found matching your search.</p>
            <button className="primary-btn sm" onClick={() => { setShowForm(true); setEditingProduct(null); }}>
              <Plus size={15} /> Add Product
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>GST Rate</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isLow = product.stock_quantity <= product.low_stock_limit;
                  return (
                    <tr key={product._id}>
                      <td>
                        <strong>{product.product_name}</strong>
                      </td>
                      <td>
                        <span className="mono-text">{product.barcode || "—"}</span>
                      </td>
                      <td>
                        <span className="badge-category">{product.category || "General"}</span>
                      </td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.gst_rate}%</td>
                      <td>
                        <strong>{product.stock_quantity}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${isLow ? "low-stock" : "in-stock"}`}>
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="action-icon-btn edit"
                          title="Edit"
                          onClick={() => handleEditClick(product)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="action-icon-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(product._id, product.product_name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
