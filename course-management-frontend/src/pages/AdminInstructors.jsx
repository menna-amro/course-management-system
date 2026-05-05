import { useEffect, useState } from "react";
import instructorService from "../services/instructorService";
import api from "../services/api";
// import { useMessage } from "../hooks/useMessage";

function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const data = await instructorService.getAll();
      setInstructors(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load instructors.");
    }
  };

  const viewCourses = async (instructor) => {
    setSelectedInstructor(instructor);

    try {
      const result = await instructorService.getCourses(instructor.id);
      setInstructorCourses(result);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load instructor courses.", 'error');
    }
  };

  const deleteInstructor = async (id, name) => {
    if (!confirm(`Delete instructor "${name}"? This will remove all their courses.`)) return;

    try {
      await instructorService.deleteInstructor(id);
      setMessage(`Instructor "${name}" deleted successfully`);
      loadInstructors(); // Refresh list
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete instructor");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="section-header">
          <div>
            <h1>All Instructors</h1>
            <p>View instructor contact details and their assigned courses.</p>
          </div>
        </div>

        {message && <p className="status-message">{message}</p>}

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.id}>
                  <td>{instructor.id}</td>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>
                    <button className="button secondary" onClick={() => viewCourses(instructor)}>
                      View Courses
                    </button>
                    <button className="button danger small" onClick={() => deleteInstructor(instructor.id, instructor.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedInstructor && (
          <div className="page-card" style={{ marginTop: "24px" }}>
            <h2>Courses assigned to {selectedInstructor.name}</h2>
            {instructorCourses.length === 0 ? (
              <p className="info">This instructor has no assigned courses yet.</p>
            ) : (
              <div className="course-grid">
                {instructorCourses.map((course, index) => (
                  <div key={index} className="course-card">
                    <h3>{course.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInstructors;
