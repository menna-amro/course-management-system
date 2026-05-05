import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import courseService from "../services/courseService";
import instructorService from "../services/instructorService";

function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    instructorId: ""
  });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const data = await instructorService.getAll();
        setInstructors(data);
      } catch (err) {
        setError("Unable to load instructors. Please verify backend or Admin access.");
      }
    };

    loadInstructors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!formData.instructorId) {
      setError("Please choose an instructor.");
      return;
    }

    setLoading(true);

    try {
      const response = await courseService.createCourse({
        title: formData.title.trim(),
        instructorId: Number(formData.instructorId)
      });
      setMessage(response.message || "Course created successfully.");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creating course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>Create Course</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Course Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Course name"
              required
            />
          </label>

          <label>
            Instructor
            <select
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
              required
            >
              <option value="">Select instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </label>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Course"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default AddCourse;