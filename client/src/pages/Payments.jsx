import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const API = "http://localhost:4000/api";

function Payments() {

  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const [billId, setBillId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const loadData = async () => {

    try {

      const [billResponse, paymentResponse] =
        await Promise.all([
          fetch(`${API}/billing`),
          fetch(`${API}/payments`)
        ]);

      const billData =
        await billResponse.json();

      const paymentData =
        await paymentResponse.json();

      if (billData.success) {
        setBills(billData.bills);
      }

      if (paymentData.success) {
        setPayments(paymentData.payments);
      }

    } catch {

      setError("Unable to load payment data");

    }

  };


  useEffect(() => {
    loadData();
  }, []);


  const createPayment = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (!billId || !amount) {

      setError(
        "Please select bill and enter amount"
      );

      return;

    }


    try {

      const response = await fetch(
        `${API}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bill_id: billId,
            amount: Number(amount),
            payment_method: method,
            transaction_id: transactionId
          })
        }
      );


      const data = await response.json();


      if (data.success) {

        setMessage(
          "Payment recorded successfully!"
        );

        setBillId("");
        setAmount("");
        setTransactionId("");

        loadData();

      } else {

        setError(
          data.message || "Payment failed"
        );

      }

    } catch {

      setError(
        "Unable to connect to backend"
      );

    }

  };


  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <Link to="/" className="back-link">
            <LayoutDashboard size={15} /> Dashboard
          </Link>

          <h1>Payments</h1>

          <p>
            Record and manage bill payments.
          </p>

        </div>

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


      <div className="form-panel">

        <h2>Record Payment</h2>

        <form onSubmit={createPayment}>

          <div className="form-grid">

            <div className="form-group">

              <label>Bill</label>

              <select
                value={billId}
                onChange={e =>
                  setBillId(e.target.value)
                }
              >

                <option value="">
                  Select Bill
                </option>

                {bills.map(bill => (

                  <option
                    key={bill._id}
                    value={bill._id}
                  >
                    {bill.invoice_number} -
                    ₹{bill.grand_total}
                  </option>

                ))}

              </select>

            </div>


            <div className="form-group">

              <label>Amount</label>

              <input
                type="number"
                min="0"
                value={amount}
                onChange={e =>
                  setAmount(e.target.value)
                }
                placeholder="Enter amount"
              />

            </div>


            <div className="form-group">

              <label>Payment Method</label>

              <select
                value={method}
                onChange={e =>
                  setMethod(e.target.value)
                }
              >

                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>

              </select>

            </div>


            <div className="form-group">

              <label>Transaction ID</label>

              <input
                type="text"
                value={transactionId}
                onChange={e =>
                  setTransactionId(e.target.value)
                }
                placeholder="Optional"
              />

            </div>

          </div>


          <button
            type="submit"
            className="save-btn"
          >
            Record Payment
          </button>

        </form>

      </div>


      <div className="product-panel">

        <div className="table-header">

          <h2>Payment History</h2>

          <span>
            {payments.length} payment(s)
          </span>

        </div>


        {payments.length === 0 ? (

          <div className="status-message">
            No payments found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Bill</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>

              </thead>


              <tbody>

                {payments.map(payment => (

                  <tr key={payment._id}>

                    <td>
                      {payment.bill_id?.invoice_number || "-"}
                    </td>

                    <td>
                      ₹{Number(
                        payment.amount
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {payment.payment_method}
                    </td>

                    <td>
                      <span className="stock-good">
                        {payment.payment_status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        payment.payment_date
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

export default Payments;