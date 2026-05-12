import { Link, useNavigate, Outlet } from "react-router-dom";
import "../styles/global.css";

function Layout({ setIsAuthenticated }) {

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="app-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>SRS AI</h2>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/upload">Upload Document</Link></li>
          <li><Link to="/history">History</Link></li>
          <li style={{ cursor: "pointer", color: "#f87171" }} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="topbar">
          <h2>Welcome Back 👋</h2>
          <div className="topbar-icons">
            <span>🔔</span>
            <span onClick={toggleDarkMode} style={{ cursor: "pointer" }}>🌙</span>
            <span>👤 Profile</span>
          </div>
        </div>

        {/* THIS is where nested pages render */}
        <Outlet />

      </div>
    </div>
  );
}

export default Layout;