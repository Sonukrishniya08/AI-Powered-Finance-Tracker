import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="profile-section">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>

          <Link to="/profile" className="profile-btn">
            Manage Profile
          </Link>
        </div>

        <div className="menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/budgets">Budgets</Link>
          <Link to="/reports">Reports</Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        <div className="top-navbar">
          <h2>Personal Finance Tracker</h2>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="page-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
