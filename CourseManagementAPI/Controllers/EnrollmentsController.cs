using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _service;

        public EnrollmentsController(IEnrollmentService service)
        {
            _service = service;
        }


        // ================= STUDENT ENROLL HIMSELF =================

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> EnrollMyself(
            CreateStudentEnrollmentDto dto)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            await _service.EnrollStudentAsync(dto, userId);

            return Ok(new
            {
                success = true,
                message = "Enrollment successful"
            });
        }


        // ================= ADMIN ENROLL ANY STUDENT =================

        [HttpPost("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EnrollStudentByAdmin(
            CreateAdminEnrollmentDto dto)
        {
            await _service.EnrollStudentByAdminAsync(dto);

            return Ok(new
            {
                success = true,
                message = "Student enrolled successfully by admin"
            });
        }


        // ================= GET MY COURSES =================

        [HttpGet("my-courses")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            var result =
                await _service.GetStudentCoursesAsync(userId);

            return Ok(result);
        }

        [HttpDelete("me/{courseId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> WithdrawFromCourse(int courseId)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            await _service.WithdrawStudentAsync(userId, courseId);

            return Ok(new
            {
                success = true,
                message = "You have withdrawn from the course."
            });
        }


        // ================= GET COURSE STUDENTS =================

        [HttpGet("course/{courseId}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> GetCourseStudents(int courseId)
        {
            var result =
                await _service.GetCourseStudentsAsync(courseId);

            return Ok(result);
        }


        // ================= DELETE ENROLLMENT =================

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(
            int studentId,
            int courseId)
        {
            await _service.DeleteAsync(studentId, courseId);

            return Ok(new
            {
                success = true,
                message = "Enrollment removed successfully"
            });
        }
    }
}