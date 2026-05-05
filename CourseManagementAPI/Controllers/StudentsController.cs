using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.DTOs.Student;
using CourseManagementAPI.Services.Interfaces;
using System.Security.Claims;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;

        public StudentController(IStudentService service)
        {
            _service = service;
        }


        // ================= CREATE MY PROFILE =================

        [HttpPost("me")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> CreateMyProfile(CreateStudentDto dto)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            await _service.CreateAsync(dto, userId);

            return Ok(new
            {
                success = true,
                message = "Student profile created successfully"
            });
        }


        // ================= GET MY PROFILE =================

        [HttpGet("me")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            var student =
                await _service.GetByUserIdAsync(userId);

            if (student == null)
                return NoContent();

            return Ok(student);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateStudentDto dto)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            await _service.UpdateByUserIdAsync(userId, dto);

            return Ok(new
            {
                success = true,
                message = "Student profile updated successfully"
            });
        }

        [HttpGet("courses/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStudentCourses(int id)
        {
            var courses = await _service.GetCoursesAsync(id);
            return Ok(courses);
        }

        // ================= GET ALL STUDENTS (ADMIN ONLY) =================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var students = await _service.GetAllAsync();

            return Ok(students);
        }


        // ================= DELETE STUDENT (ADMIN ONLY) =================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return Ok(new
            {
                success = true,
                message = "Student deleted successfully"
            });
        }
    }
}