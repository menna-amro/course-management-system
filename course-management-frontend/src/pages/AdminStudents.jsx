import { useEffect, useState } from "react";
import studentService from "../services/studentService";
import api from "../services/api";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load students.");
    }
  };

  const viewCourses = async (student) => {
    setSelectedStudent(student);

    try {
      const result = await studentService.getCourses(student.id);
      setStudentCourses(result);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load student courses.");
    }
  };

  const deleteStudent = async (id, name) => {
    if (!confirm(`Delete student "${name}"? This will remove all their enrollments.`)) return;

    try {
      await studentService.deleteStudent(id);
      setMessage(`Student "${name}" deleted successfully`);
      loadStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete student");
    }
  };

  // ✅ الحل النهائي هنا
  const removeStudentFromCourse = async (courseId) => {
    if (!confirm(`Remove ${selectedStudent.name} from this course?`)) return;

    try {
      await api.delete(`/enrollments`, {
        params: {
          studentId: selectedStudent.id,
          courseId: courseId
        }
      });

      // تحديث UI
      setStudentCourses(prev =>
        prev.filter(c => c.courseId !== courseId)
      );

      setMessage("Student removed from course successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to remove student from course");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <div className="section-header">
          <div>
            <h1>All Students</h1>
            <p>View student information and the courses they are enrolled in.</p>
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
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className="button secondary"
                      onClick={() => viewCourses(student)}
                    >
                      View Courses
                    </button>

                    <button
                      className="button danger small"
                      onClick={() => deleteStudent(student.id, student.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div className="page-card" style={{ marginTop: "24px" }}>
            <h2>Courses for {selectedStudent.name}</h2>

            {studentCourses.length === 0 ? (
              <p className="info">
                This student is not enrolled in any courses.
              </p>
            ) : (
              <div className="course-grid">
                {studentCourses.map((course, index) => (
                  <div key={index} className="course-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <h3>{course.courseTitle}</h3>
                        <p>Instructor: {course.instructorName}</p>
                      </div>

                      <button
                        className="button danger small"
                        onClick={() =>
                          removeStudentFromCourse(course.courseId)
                        }
                      >
                        Remove
                      </button>
                    </div>
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

export default AdminStudents;