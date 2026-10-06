import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Plus } from "lucide-react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/customers"
      );

      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
      }
    } catch {
      setError("Backend server is not connected");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Customer added successfully!");

        setShowForm(false);

        setForm({
          name: "",
          phone: "",
          email: "",
          address: "",
          gst_number: "",
        });

        fetchCustomers();
      } else {
        setError(data.message || "Failed to add customer");
      }
    } catch {
      setError("Unable to connect to backend");
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <Link to="/" className="back-link">
            <LayoutDashboard size={15} /> Dashboard
          </Link>

          <h1>Customers</h1>

          <p>
            Manage your customers and their details.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : <><Plus size={16} /> Add Customer</>}
        </button>

      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="form-panel">

          <h2>Add New Customer</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Customer Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>

                <input
                  type="text"
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

            </div>

            <button
              type="submit"
              className="save-btn"
            >
              Save Customer
            </button>

          </form>

        </div>
      )}

      <div className="product-panel">

        <div className="table-header">

          <h2>All Customers</h2>

          <span>
            {customers.length} customer(s)
          </span>

        </div>

        {customers.length === 0 ? (

          <div className="status-message">
            No customers found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>GST Number</th>
                </tr>
              </thead>

              <tbody>

                {customers.map((customer) => (

                  <tr key={customer._id}>

                    <td>
                      <strong>
                        {customer.name}
                      </strong>
                    </td>

                    <td>
                      {customer.phone}
                    </td>

                    <td>
                      {customer.email || "-"}
                    </td>

                    <td>
                      {customer.address || "-"}
                    </td>

                    <td>
                      {customer.gst_number || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Customers;