import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instructorService from "../services/instructorService";
import studentService from "../services/studentService";

function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 👇 error من sessionStorage
  useEffect(() => {
    const savedError = sessionStorage.getItem("loginError");

    if (savedError) {
      setError(savedError);

      setTimeout(() => {
        setError("");
        sessionStorage.removeItem("loginError");
      }, 5000);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await login(formData);

      // success message
      setSuccess("Logged in successfully!");

      setTimeout(async () => {
        if (data.role === "Instructor") {
          const profile = await instructorService.getMyProfile();

          if (profile && profile.id) {
            navigate("/instructor-dashboard");
          } else {
            navigate("/create-instructor-profile");
          }
        } else if (data.role === "Student") {
          const profile = await studentService.getMyProfile();

          if (profile && profile.id) {
            navigate("/dashboard");
          } else {
            navigate("/create-student-profile");
          }
        } else {
          navigate("/dashboard");
        }
      }, 3000);

    } catch (err) {
      sessionStorage.setItem(
        "loginError",
        "Login failed. Check credentials and try again."
      );

      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {/* ❌ Error */}
        {error && (
          <div className="error" style={{ marginTop: "15px" }}>
            {error}
          </div>
        )}

        {/* ✅ Success */}
        {success && (
          <div className="success" style={{ marginTop: "15px" }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;