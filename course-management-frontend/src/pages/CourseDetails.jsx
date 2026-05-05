import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import courseService from "../services/courseService";
import { useAuth } from "../context/AuthContext";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await courseService.getById(id);
        setCourse(data);
      } catch (error) {
        setMessage("Course details could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleDelete = async () => {
    try {
      await courseService.deleteCourse(id);
      navigate("/courses");
    } catch (error) {
      setMessage("Unable to delete course.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>Course Details</h1>

        {loading && <p className="info">Loading course...</p>}

        {!loading && message && <p className="error">{message}</p>}

        {!loading && course && (
          <div className="course-card">
            <div>
              <h2>{course.title}</h2>
              <p>
                <strong>Instructor ID:</strong> {course.instructorId}
              </p>
              <p>
                <strong>Instructor name:</strong> {course.instructorName}
              </p>
            </div>

            <div className="button-row">
              <button className="button secondary" onClick={() => navigate("/courses")}>Back</button>
              {role === "Admin" && (
                <>
                  <button className="button" onClick={() => navigate(`/courses/edit/${course.id}`)}>
                    Edit
                  </button>
                  <button className="button danger" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
