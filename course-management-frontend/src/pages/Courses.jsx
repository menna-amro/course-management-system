import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import courseService from "../services/courseService";
import api from "../services/api";

function Courses() {
  const { role } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [profileCreationNeeded, setProfileCreationNeeded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    if (role === "Student") {
      fetchMyCourses();
    }
  }, [role]);

  // ================= GET COURSES =================
  const fetchCourses = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  // ================= GET MY COURSES =================
  const fetchMyCourses = async () => {
    try {
      const res = await api.get("/enrollments/my-courses");
      setEnrolledCourses(res.data.map((course) => course.courseId));
    } catch (error) {
      setEnrolledCourses([]);
    }
  };

  // ================= DELETE COURSE =================
  const deleteCourse = async (id) => {
    setMessage("");
    try {
      await courseService.deleteCourse(id);
      setMessage("Course deleted successfully.");
      fetchCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete course.");
    }
  };

  // ================= ENROLL COURSE =================
  const enroll = async (courseId) => {
    setMessage("");
    setProfileCreationNeeded(false);
    try {
      const response = await api.post("/enrollments", { courseId });
      setMessage(response.data.message || "Enrolled successfully.");
      setEnrolledCourses((prev) => [...prev, courseId]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Enrollment failed.";
      if (errorMessage.includes("Student profile not found")) {
        setProfileCreationNeeded(true);
      } else {
        setMessage(errorMessage);
      }
    }
  };

  // ================= VIEW COURSE STUDENTS =================
  const viewStudents = async (courseId) => {
    setMessage("");
    try {
      const response = await api.get(`/enrollments/course/${courseId}`);
      setCourseStudents(response.data);
      setSelectedCourse(courseId);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load students.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="section-header">
          <div>
            <h1>Courses</h1>
            <p>Browse classes and join the ones that fit your goals.</p>
          </div>
          {role === "Admin" && (
            <button className="button" onClick={() => navigate("/courses/new")}>Add New Course</button>
          )}
        </div>

        {message && <p className="status-message">{message}</p>}

        {profileCreationNeeded && (
          <div className="page-card" style={{ marginBottom: "24px", backgroundColor: "#fff3cd", borderColor: "#ffeaa7" }}>
            <p>You need to create a student profile before you can enroll in courses.</p>
            <button className="button" onClick={() => navigate("/create-student-profile")}>
              Create Student Profile
            </button>
          </div>
        )}

        {loading ? (
          <p className="info">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="info">No courses found.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-content">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.instructorName}</p>
                </div>
                <div className="button-row">
                  <button className="button secondary" onClick={() => navigate(`/courses/${course.id}`)}>
                    View Details
                  </button>

                  {role === "Admin" && (
                    <>
                      <button className="button secondary" onClick={() => viewStudents(course.id)}>
                        View Students
                      </button>
                      <button className="button" onClick={() => navigate(`/courses/edit/${course.id}`)}>
                        Edit
                      </button>
                      <button className="button danger" onClick={() => deleteCourse(course.id)}>
                        Delete
                      </button>
                    </>
                  )}

                  {role === "Student" && (
                    enrolledCourses.includes(course.id) ? (
                      <button className="button disabled" disabled>
                        Enrolled
                      </button>
                    ) : (
                      <button className="button" onClick={() => enroll(course.id)}>
                        Enroll
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= COURSE STUDENTS ================= */}
        {selectedCourse && (
          <div className="page-card" style={{ marginTop: "24px" }}>
            <h2>Students Enrolled in {courses.find(c => c.id === selectedCourse)?.title}</h2>

            {courseStudents.length === 0 ? (
              <p className="info">No students enrolled in this course.</p>
            ) : (
              <div className="course-grid">
                {courseStudents.map((enrollment, index) => (
                  <div key={index} className="course-card">
                    <h3>{enrollment.studentName}</h3>
                    <p>Student ID: {enrollment.studentId}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="button secondary" onClick={() => setSelectedCourse(null)} style={{ marginTop: "16px" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;