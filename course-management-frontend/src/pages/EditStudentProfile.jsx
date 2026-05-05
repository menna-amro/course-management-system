import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentService from "../services/studentService";
import { useAuth } from "../context/AuthContext";

function EditStudentProfile() {
  const [form, setForm] = useState({
    name: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentProfile, setCurrentProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const profile = await studentService.getMyProfile();
      setCurrentProfile(profile);
      setForm({
        name: profile.name || "",
        email: profile.email || ""
      });
    } catch (err) {
      setError("Failed to load current profile");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Backend doesn't have update endpoint, so delete & recreate
      // First delete current profile
      // Note: This is workaround - backend needs proper PUT endpoint
      
      // For now, redirect to create new with warning
      setError("Backend update not implemented. Please delete existing profile or contact admin.");
      return;

      setMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/my-profile");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>Edit Student Profile</h1>
        {currentProfile && (
          <p className="info">
            Current: {currentProfile.name} - {currentProfile.email}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button 
              type="button" 
              className="button secondary small"
              onClick={() => navigate("/my-profile")}
            >
              Cancel
            </button>
          </div>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)' }}>
          <strong>Note:</strong> Backend doesn't support profile updates yet. Consider creating new profile with different email or contact admin.
        </div>
      </div>
    </div>
  );
}

export default EditStudentProfile;
