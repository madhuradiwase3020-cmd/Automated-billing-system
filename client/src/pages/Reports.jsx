import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Boxes, LayoutDashboard, Receipt, RefreshCw, Users } from "lucide-react";

const API = "http://localhost:4000/api";

function Reports() {

  const [dashboard, setDashboard] = useState(null);
  const [sales, setSales] = useState(null);
  const [error, setError] = useState("");


  const loadReports = async () => {

    try {

      const [
        dashboardResponse,
        salesResponse
      ] = await Promise.all([
        fetch(`${API}/reports/dashboard`),
        fetch(`${API}/reports/sales`)
      ]);


      const dashboardData =
        await dashboardResponse.json();

      const salesData =
        await salesResponse.json();


      if (dashboardData.success) {
        setDashboard(dashboardData);
      }

      if (salesData.success) {
        setSales(salesData);
      }

    } catch {

      setError(
        "Unable to load reports"
      );

    }

  };


  useEffect(() => {
    loadReports();
  }, []);


  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <Link to="/" className="back-link">
            <LayoutDashboard size={15} /> Dashboard
          </Link>

          <h1>Reports</h1>

          <p>
            Sales and business performance reports.
          </p>

        </div>


        <button
          className="add-btn"
          onClick={loadReports}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <div className="stats">

        <div className="card">
          <div className="card-icon purple">
            <Boxes size={25} />
          </div>
          <div>
            <span>Total Products</span>
            <h2>
              {dashboard?.totalProducts || 0}
            </h2>
          </div>
        </div>


        <div className="card">
          <div className="card-icon blue">
            <Users size={25} />
          </div>
          <div>
            <span>Total Customers</span>
            <h2>
              {dashboard?.totalCustomers || 0}
            </h2>
          </div>
        </div>


        <div className="card">
          <div className="card-icon green">
            <Receipt size={25} />
          </div>
          <div>
            <span>Total Bills</span>
            <h2>
              {dashboard?.totalBills || 0}
            </h2>
          </div>
        </div>


        <div className="card">
          <div className="card-icon orange">
            <BarChart3 size={25} />
          </div>
          <div>
            <span>Total Revenue</span>
            <h2>
              ₹{Number(
                dashboard?.totalRevenue || 0
              ).toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </div>


      <div className="product-panel">

        <div className="table-header">

          <h2>Sales Report</h2>

          <span>
            Paid Bills
          </span>

        </div>


        {!sales?.bills ||
        sales.bills.length === 0 ? (

          <div className="status-message">
            No sales data available.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>

              </thead>


              <tbody>

                {sales.bills.map(bill => (

                  <tr key={bill._id}>

                    <td>
                      <strong>
                        {bill.invoice_number}
                      </strong>
                    </td>

                    <td>
                      {bill.customer_id?.name || "-"}
                    </td>

                    <td>
                      ₹{Number(
                        bill.grand_total
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {new Date(
                        bill.createdAt
                      ).toLocaleDateString("en-IN")}
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

export default Reports;