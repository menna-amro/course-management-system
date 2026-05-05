import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails";
import EditCourse from "./pages/EditCourse";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminInstructors from "./pages/AdminInstructors";
import CreateInstructorProfile from "./pages/CreateInstructorProfile";
import CreateStudentProfile from "./pages/CreateStudentProfile";
import MyProfile from "./pages/MyProfile";

import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="page-container">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* COMMON */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Student", "Instructor", "Admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={["Student", "Instructor", "Admin"]}>
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/new"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AddCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute allowedRoles={["Student", "Instructor", "Admin"]}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />

          {/* STUDENT */}
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/instructors"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminInstructors />
              </ProtectedRoute>
            }
          />

          {/* INSTRUCTOR */}
          <Route
            path="/instructor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-instructor-profile"
            element={
              <ProtectedRoute allowedRoles={["Instructor"]}>
                <CreateInstructorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-student-profile"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <CreateStudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-profile"
            element={
              <ProtectedRoute allowedRoles={["Student", "Instructor"]}>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;