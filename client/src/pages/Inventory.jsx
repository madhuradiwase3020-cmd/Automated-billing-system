import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const API = "http://localhost:4000/api";

function Inventory() {

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const loadInventory = async () => {

    try {

      const response = await fetch(
        `${API}/inventory`
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.inventory);
      }

    } catch {

      setError(
        "Unable to load inventory"
      );

    }

  };


  useEffect(() => {
    loadInventory();
  }, []);


  const updateStock = async (
    id,
    stock
  ) => {

    try {

      const response = await fetch(
        `${API}/inventory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            stock_quantity: Number(stock)
          })
        }
      );


      const data = await response.json();


      if (data.success) {

        setMessage(
          "Stock updated successfully!"
        );

        loadInventory();

      } else {

        setError(
          data.message || "Update failed"
        );

      }

    } catch {

      setError(
        "Unable to update stock"
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

          <h1>Inventory</h1>

          <p>
            Manage product stock and inventory levels.
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


      <div className="product-panel">

        <div className="table-header">

          <h2>Inventory</h2>

          <span>
            {products.length} product(s)
          </span>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Product</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Low Limit</th>
                <th>Status</th>
                <th>Update</th>
              </tr>

            </thead>


            <tbody>

              {products.map(product => (

                <tr key={product._id}>

                  <td>
                    <strong>
                      {product.product_name}
                    </strong>
                  </td>

                  <td>
                    {product.barcode || "-"}
                  </td>

                  <td>
                    {product.category}
                  </td>

                  <td>
                    {product.stock_quantity}
                  </td>

                  <td>
                    {product.low_stock_limit}
                  </td>

                  <td>

                    {product.stock_quantity <=
                    product.low_stock_limit ? (

                      <span className="stock-low">
                        Low Stock
                      </span>

                    ) : (

                      <span className="stock-good">
                        In Stock
                      </span>

                    )}

                  </td>

                  <td>

                    <button
                      className="small-btn"
                      onClick={() => {

                        const value =
                          prompt(
                            "Enter new stock quantity:",
                            product.stock_quantity
                          );

                        if (
                          value !== null &&
                          value !== ""
                        ) {
                          updateStock(
                            product._id,
                            value
                          );
                        }

                      }}
                    >
                      Update
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default Inventory;