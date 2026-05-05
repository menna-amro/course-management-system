import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { isAuthenticated, role, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="brand">
        <NavLink to="/" className="brand-link">
          Course Manager
        </NavLink>
      </div>

      <nav className="nav-links">
        <NavLink to="/courses">Courses</NavLink>
        {role === "Admin" && <NavLink to="/courses/new">Create Course</NavLink>}
        {role === "Admin" && <NavLink to="/admin/students">All Students</NavLink>}
        {role === "Admin" && <NavLink to="/admin/instructors">All Instructors</NavLink>}
        {role === "Student" && <NavLink to="/my-courses">My Courses</NavLink>}
        {role === "Instructor" && <NavLink to="/instructor-dashboard">Instructor Dashboard</NavLink>}
        {(role === "Student" || role === "Instructor") && <NavLink to="/my-profile">My Profile</NavLink>}
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="user-pill">{username} • {role}</span>
            <button className="button small" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;