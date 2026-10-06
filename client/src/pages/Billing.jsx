import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, Trash2 } from "lucide-react";

const API = "http://localhost:4000/api";

function Billing() {

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {

    Promise.all([
      fetch(`${API}/customers`).then(r => r.json()),
      fetch(`${API}/products`).then(r => r.json())
    ])
      .then(([customerData, productData]) => {

        if (customerData.success) {
          setCustomers(customerData.customers);
        }

        if (productData.success) {
          setProducts(productData.products);
        }

      })
      .catch(() => {
        setError("Unable to load customers/products");
      });

  }, []);


  const addItem = () => {

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    const product = products.find(
      p => p._id === selectedProduct
    );

    if (!product) return;

    if (Number(quantity) > product.stock_quantity) {
      setError("Insufficient stock");
      return;
    }


    const existing = items.find(
      item => item.product_id === product._id
    );


    if (existing) {

      setItems(
        items.map(item =>
          item.product_id === product._id
            ? {
                ...item,
                quantity:
                  item.quantity + Number(quantity)
              }
            : item
        )
      );

    } else {

      setItems([
        ...items,
        {
          product_id: product._id,
          product_name: product.product_name,
          price: product.price,
          gst_rate: product.gst_rate,
          quantity: Number(quantity)
        }
      ]);

    }


    setSelectedProduct("");
    setQuantity(1);
    setError("");
  };


  const removeItem = (id) => {

    setItems(
      items.filter(item => item.product_id !== id)
    );

  };


  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  const totalGST = items.reduce(
    (sum, item) =>
      sum +
      (item.price *
        item.quantity *
        item.gst_rate) /
        100,
    0
  );


  const grandTotal = subtotal + totalGST;


  const createBill = async () => {

    setMessage("");
    setError("");


    if (!customerId) {
      setError("Please select a customer");
      return;
    }


    if (items.length === 0) {
      setError("Please add at least one product");
      return;
    }


    try {

      const response = await fetch(
        `${API}/billing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            customer_id: customerId,
            items: items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity
            }))
          })
        }
      );


      const data = await response.json();


      if (data.success) {

        setMessage(
          `Bill created successfully! Invoice: ${data.bill.invoice_number}`
        );

        setItems([]);
        setCustomerId("");

        setTimeout(() => {
          navigate("/invoices");
        }, 1500);

      } else {

        setError(
          data.message || "Failed to create bill"
        );

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

          <h1>Create Bill</h1>

          <p>
            Select customer and products to generate a bill.
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

        <h2>Customer</h2>

        <div className="form-group">

          <label>Select Customer</label>

          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
          >

            <option value="">
              Select Customer
            </option>

            {customers.map(customer => (

              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name} - {customer.phone}
              </option>

            ))}

          </select>

        </div>

      </div>


      <div className="form-panel">

        <h2>Add Products</h2>

        <div className="billing-product-row">

          <select
            value={selectedProduct}
            onChange={e =>
              setSelectedProduct(e.target.value)
            }
          >

            <option value="">
              Select Product
            </option>

            {products.map(product => (

              <option
                key={product._id}
                value={product._id}
              >
                {product.product_name} -
                ₹{product.price} -
                Stock: {product.stock_quantity}
              </option>

            ))}

          </select>


          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e =>
              setQuantity(e.target.value)
            }
          />


          <button
            className="add-btn"
            onClick={addItem}
          >
            <Plus size={16} /> Add
          </button>

        </div>

      </div>


      <div className="product-panel">

        <div className="table-header">

          <h2>Bill Items</h2>

          <span>
            {items.length} item(s)
          </span>

        </div>


        {items.length === 0 ? (

          <div className="status-message">
            No products added.
          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>GST</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {items.map(item => {

                  const itemSubtotal =
                    item.price * item.quantity;

                  const itemGST =
                    itemSubtotal *
                    item.gst_rate /
                    100;

                  const itemTotal =
                    itemSubtotal + itemGST;


                  return (

                    <tr key={item.product_id}>

                      <td>
                        <strong>
                          {item.product_name}
                        </strong>
                      </td>

                      <td>
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        ₹{itemGST.toLocaleString("en-IN")}
                      </td>

                      <td>
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeItem(item.product_id)
                          }
                        >
                          <Trash2 size={15} /> Remove
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


      <div className="bill-summary">

        <div>
          <span>Subtotal</span>
          <strong>
            ₹{subtotal.toLocaleString("en-IN")}
          </strong>
        </div>

        <div>
          <span>Total GST</span>
          <strong>
            ₹{totalGST.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="grand-total">
          <span>Grand Total</span>
          <strong>
            ₹{grandTotal.toLocaleString("en-IN")}
          </strong>
        </div>

        <button
          className="save-btn"
          onClick={createBill}
        >
          Create Bill
        </button>

      </div>

    </div>
  );
}

export default Billing;