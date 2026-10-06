import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

function SettingsPage() {

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <Link to="/" className="back-link">
            <LayoutDashboard size={15} /> Dashboard
          </Link>

          <h1>Settings</h1>

          <p>
            Manage your billing system settings.
          </p>

        </div>

      </div>


      <div className="form-panel">

        <h2>Application Settings</h2>


        <div className="settings-box">

          <div>
            <strong>Application Name</strong>
            <span>
              Automated Billing System
            </span>
          </div>

        </div>


        <div className="settings-box">

          <div>
            <strong>Currency</strong>
            <span>
              Indian Rupee (₹)
            </span>
          </div>

        </div>


        <div className="settings-box">

          <div>
            <strong>Database</strong>
            <span>
              MongoDB
            </span>
          </div>

        </div>


        <div className="settings-box">

          <div>
            <strong>Backend API</strong>
            <span>
              http://localhost:4000/api
            </span>
          </div>

        </div>

      </div>

    </div>

  );
}

export default SettingsPage;