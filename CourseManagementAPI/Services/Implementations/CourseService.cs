using Microsoft.EntityFrameworkCore;
using CourseManagementAPI;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;
using CourseManagementAPI.Models;

namespace CourseManagementAPI.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseDto>> GetAllAsync()
        {
            return await _context.Courses
                .AsNoTracking()
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Name
                })
                .ToListAsync();
        }

        public async Task<CourseDto?> GetByIdAsync(int id)
        {
            return await _context.Courses
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorId = c.InstructorId,
                    InstructorName = c.Instructor.Name
                })
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(CreateCourseDto dto)
        {
            var course = new Course
            {
                Title = dto.Title,
                InstructorId = dto.InstructorId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(int id, UpdateCourseDto dto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return;

            course.Title = dto.Title;
            course.InstructorId = dto.InstructorId;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }
    }
}