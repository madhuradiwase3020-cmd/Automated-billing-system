import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, LayoutDashboard } from "lucide-react";

const API = "http://localhost:4000/api";

function Invoices() {

  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  const fetchBills = async () => {

    try {

      const response = await fetch(
        `${API}/billing`
      );

      const data = await response.json();

      if (data.success) {
        setBills(data.bills);
      }

    } catch {

      setError("Unable to load invoices");

    }

  };


  useEffect(() => {
    fetchBills();
  }, []);


  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <Link to="/" className="back-link">
            <LayoutDashboard size={15} /> Dashboard
          </Link>

          <h1>Invoices</h1>

          <p>
            View and download generated invoices.
          </p>

        </div>

      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <div className="product-panel">

        <div className="table-header">

          <h2>All Invoices</h2>

          <span>
            {bills.length} invoice(s)
          </span>

        </div>


        {bills.length === 0 ? (

          <div className="status-message">
            No invoices found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>PDF</th>
                </tr>

              </thead>


              <tbody>

                {bills.map(bill => (

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
                      {new Date(
                        bill.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      ₹{Number(
                        bill.grand_total
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className="stock-good">
                        {bill.payment_status}
                      </span>
                    </td>

                    <td>

                      <a
                        href={`${API}/invoices/${bill._id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="download-btn"
                      >
                        <FileText size={15} />
                        PDF
                      </a>

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

export default Invoices;