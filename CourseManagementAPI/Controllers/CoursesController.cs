using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;

namespace CourseManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IEnrollmentService _enrollmentService;

        public CourseController(ICourseService courseService, IEnrollmentService enrollmentService)
        {
            _courseService = courseService;
            _enrollmentService = enrollmentService;
        }

        // GET: api/course
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _courseService.GetAllAsync();
            return Ok(courses);
        }

        // GET: api/course/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            return Ok(course);
        }

        // POST: api/course
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateCourseDto dto)
        {
            await _courseService.CreateAsync(dto);
            return Ok(new
            {
                success = true,
                message = "Course created successfully"
            });
        }

        // PUT: api/course/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateCourseDto dto)
        {
            await _courseService.UpdateAsync(id, dto);
            return Ok(new
            {
                success = true,
                message = "Course updated successfully"
            });
        }

        // DELETE: api/course/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _courseService.DeleteAsync(id);
            return Ok(new
            {
                success = true,
                message = "Course deleted successfully"
            });
        }

        // ADMIN: Remove specific student from course
        [HttpDelete("{courseId}/students/{studentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveStudentFromCourse(int courseId, int studentId)
        {
            await _enrollmentService.DeleteAsync(studentId, courseId);
            return Ok(new
            {
                success = true,
                message = "Student removed from course successfully"
            });
        }
    }
}
