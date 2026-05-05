import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyCourses() {
  const { role } = useAuth();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchMyCourses();
  }, []);



  const fetchMyCourses = async () => {
    try {
      const response = await api.get("/enrollments/my-courses");
      setCourses(response.data);
    } catch (error) {
      setCourses([]);
    }
  };

  const withdraw = async (courseId) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await api.delete(`/enrollments/me/${courseId}`);
      setMessage(response.data.message || "You have withdrawn from the course.");
      await fetchMyCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>My Courses</h1>

        {message && <p className="status-message">{message}</p>}

        {courses.length === 0 ? (
          <p className="info">You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <h3>{course.courseTitle}</h3>
                <p>Instructor: {course.instructorName}</p>
                <button
                  className="button danger"
                  disabled={loading}
                  onClick={() => withdraw(course.courseId)}
                >
                  Withdraw
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;
