using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;
using CourseManagementAPI.DTOs.Instructor;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorService _service;

        public InstructorController(IInstructorService service)
        {
            _service = service;
        }

        // ================= CREATE MY PROFILE =================
        [HttpPost("me")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> CreateMyProfile(CreateInstructorDto dto)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _service.CreateAsync(dto, userId);

            return Ok(new
            {
                success = true,
                message = "Instructor profile created successfully"
            });
        }

        // ================= GET ALL (ADMIN ONLY) =================
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // ================= DELETE (ADMIN ONLY) =================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return Ok(new
            {
                success = true,
                message = "Instructor deleted successfully"
            });
        }

        // =================  MY COURSES =================
        [HttpGet("my-courses")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var courses = await _service.GetMyCoursesAsync(userId);

            return Ok(courses);
        }

        [HttpGet("me")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            var instructor = await _service.GetByUserIdAsync(userId);

            if (instructor == null)
                return NoContent();

            return Ok(instructor);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateInstructorDto dto)
        {
            var userId = User.FindFirst("UserId")?.Value;

            if (userId == null)
                return Unauthorized();

            await _service.UpdateByUserIdAsync(userId, dto);

            return Ok(new
            {
                success = true,
                message = "Instructor profile updated successfully"
            });
        }

        [HttpGet("courses/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetInstructorCourses(int id)
        {
            var courses = await _service.GetCoursesByInstructorIdAsync(id);
            return Ok(courses);
        }
    }
}