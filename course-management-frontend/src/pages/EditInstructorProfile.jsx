import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instructorService from "../services/instructorService";
import { useAuth } from "../context/AuthContext";

function EditInstructorProfile() {
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
      const profile = await instructorService.getMyProfile();
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
      await instructorService.updateMyProfile(form);
      setMessage("Profile updated successfully!");
      await fetchCurrentProfile(); // Refresh
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
        <h1>Edit Instructor Profile</h1>
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
      </div>
    </div>
  );
}

export default EditInstructorProfile;
