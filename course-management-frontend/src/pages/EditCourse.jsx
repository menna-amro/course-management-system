import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import courseService from "../services/courseService";
import instructorService from "../services/instructorService";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    instructorId: ""
  });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const course = await courseService.getById(id);
        const instructorList = await instructorService.getAll();

        setFormData({
          title: course.title || "",
          instructorId: course.instructorId?.toString() || ""
        });
        setInstructors(instructorList);
      } catch (err) {
        setError("Unable to load course details.");
      }
    };

    load();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!formData.instructorId) {
      setError("Please select an instructor.");
      return;
    }

    setLoading(true);

    try {
      await courseService.updateCourse(id, {
        title: formData.title.trim(),
        instructorId: Number(formData.instructorId)
      });
      setMessage("Course updated successfully.");
      setTimeout(() => navigate("/courses"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card auth-card">
        <h1>Edit Course</h1>

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
            {loading ? "Saving..." : "Update Course"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default EditCourse;