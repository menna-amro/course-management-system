import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instructorService from "../services/instructorService";

function CreateInstructorProfile() {
  const [form, setForm] = useState({
    name: "",
    email: ""
  });

  const [isEditing, setIsEditing] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await instructorService.getMyProfile();

        if (data) {
          setIsEditing(true);
          setForm({
            name: data.fullName || data.name || "",
            email: data.email || ""
          });
        }
      } catch (err) {
        setIsEditing(false);
      }
    };

    loadProfile();
  }, []);

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
      if (isEditing) {
        // ✅ update
        await instructorService.updateProfile({
          name: form.name.trim(),
          email: form.email.trim()
        });
        setMessage("Profile updated successfully!");
      } else {
        // ✅ create
        await instructorService.createProfile({
          name: form.name.trim(),
          email: form.email.trim()
        });
        setMessage("Profile created successfully!");
      }

      setTimeout(() => {
        navigate("/instructor-dashboard");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>{isEditing ? "Edit Instructor Profile" : "Create Instructor Profile"}</h1>

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

          <button className="button" type="submit" disabled={loading}>
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default CreateInstructorProfile;