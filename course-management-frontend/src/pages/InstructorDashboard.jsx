import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function InstructorDashboard() {
  const { role } = useAuth();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);



  // ================= GET MY COURSES =================
  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/Instructor/my-courses");
      setCourses(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage("You must create instructor profile first");

        setTimeout(() => {
          navigate("/create-instructor-profile");
        }, 1000);

      } else {
        setMessage("Failed to load courses");
      }
    }
  };

  // ================= GET STUDENTS =================
  const getStudents = async (courseId) => {
    try {
      const res = await api.get(`/Enrollments/course/${courseId}`);

      setStudents(res.data);
      setSelectedCourse(courseId);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to load students"
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>Instructor Dashboard</h1>

        {message && <p className="info">{message}</p>}

        {/* ================= COURSES ================= */}
        {courses.length === 0 ? (
          <p className="info">No courses assigned yet</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
            >
              <h3>{course.title}</h3>
              <p>Instructor: {course.instructorName}</p>
              <button className="button" onClick={() => getStudents(course.id)}>
                View Students
              </button>
            </div>
          ))
        )}

        {/* ================= STUDENTS ================= */}
        {selectedCourse && (
          <div style={{ marginTop: 20 }}>
            <h2>Students</h2>

            {students.length === 0 ? (
              <p>No students enrolled</p>
            ) : (
              students.map((s, index) => (
                <p key={index}>{s.studentName}</p>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;