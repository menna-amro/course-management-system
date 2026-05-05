import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Role-based routing
    if (role === "Student") {
      navigate("/my-courses", { replace: true });
    } else if (role === "Instructor") {
      navigate("/instructor-dashboard", { replace: true });
    } else if (role === "Admin") {
      navigate("/courses", { replace: true });
    }
  }, [role, isAuthenticated, navigate]);

  return <h2>Loading dashboard...</h2>;
}

export default Dashboard;
