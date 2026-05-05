using Microsoft.EntityFrameworkCore;
using CourseManagementAPI;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;
using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs.Instructor;

namespace CourseManagementAPI.Services.Implementations
{
    public class InstructorService : IInstructorService
    {
        private readonly AppDbContext _context;

        public InstructorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InstructorDto>> GetAllAsync()
        {
            return await _context.Instructors
                .Include(i => i.Profile)
                .AsNoTracking()
                .Select(i => new InstructorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Profile != null ? i.Profile.Email : ""
                })
                .ToListAsync();
        }

        public async Task<InstructorDto?> GetByIdAsync(int id)
        {
            return await _context.Instructors
                .Include(i => i.Profile)
                .AsNoTracking()
                .Where(i => i.Id == id)
                .Select(i => new InstructorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Profile != null ? i.Profile.Email : ""
                })
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(CreateInstructorDto dto, string userId)
        {
            var instructorExists = await _context.Instructors
                .AnyAsync(i => i.UserId == userId);

            if (instructorExists)
                throw new Exception("Instructor profile already exists");

            var studentExists = await _context.Students
                .AnyAsync(s => s.UserId == userId);

            if (studentExists)
                throw new Exception("Student cannot create instructor profile");

            var emailInInstructorProfiles = await _context.InstructorProfiles
                .AnyAsync(p => p.Email == dto.Email);

            if (emailInInstructorProfiles)
                throw new Exception("A profile with this email already exists.");

            var emailInStudentProfiles = await _context.Students
                .AnyAsync(s => s.Email == dto.Email);

            if (emailInStudentProfiles)
                throw new Exception("A profile with this email already exists.");

            var instructor = new Instructor
            {
                Name = dto.Name,
                UserId = userId
            };

            try
            {
                _context.Instructors.Add(instructor);
                await _context.SaveChangesAsync();

                var profile = new InstructorProfile
                {
                    Email = dto.Email,
                    InstructorId = instructor.Id
                };

                _context.InstructorProfiles.Add(profile);
                await _context.SaveChangesAsync();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                if (ex.InnerException?.Message?.Contains("UNIQUE") == true ||
                    ex.InnerException?.Message?.Contains("duplicate") == true)
                {
                    throw new Exception("A profile with this email already exists.");
                }
                throw;
            }
        }

        public async Task UpdateAsync(int id, UpdateInstructorDto dto)
        {
            var instructor = await _context.Instructors
                .Include(i => i.Profile)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                throw new Exception("Instructor not found");

            if (!string.IsNullOrEmpty(dto.Name))
                instructor.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Email) && instructor.Profile != null)
            {
                instructor.Profile.Email = dto.Email;
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateByUserIdAsync(string userId, UpdateInstructorDto dto)
        {
            var instructor = await _context.Instructors
                .Include(i => i.Profile)
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return;

            if (!string.IsNullOrEmpty(dto.Name))
                instructor.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.Email) && instructor.Profile != null)
            {
                // Check unique email (exclude self)
                var emailExistsStudent = await _context.Students
                    .AnyAsync(s => s.Email == dto.Email && s.UserId != userId);
                var emailExistsInstructor = await _context.InstructorProfiles
                    .AnyAsync(p => p.Email == dto.Email && p.Instructor.UserId != userId);

                if (emailExistsStudent || emailExistsInstructor)
                    throw new Exception("Email already exists for another profile");

                instructor.Profile.Email = dto.Email;
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            // First remove all related courses
            var instructor = await _context.Instructors
                .Include(i => i.Courses)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (instructor == null)
                throw new Exception("Instructor not found");

            // Remove courses first
            _context.Courses.RemoveRange(instructor.Courses);

            // Remove instructor profile if exists
            var profile = await _context.InstructorProfiles
                .FirstOrDefaultAsync(p => p.InstructorId == id);
            if (profile != null)
                _context.InstructorProfiles.Remove(profile);

            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
        }

        // ================= MY COURSES =================
        public async Task<List<CourseDto>> GetMyCoursesAsync(string userId)
        {
            var instructor = await _context.Instructors
                .FirstOrDefaultAsync(i => i.UserId == userId);

            if (instructor == null)
                return new List<CourseDto>();

            return await _context.Courses
                .Where(c => c.InstructorId == instructor.Id)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorName = instructor.Name
                })
                .ToListAsync();
        }

        public async Task<List<CourseDto>> GetCoursesByInstructorIdAsync(int instructorId)
        {
            var instructor = await _context.Instructors
                .FindAsync(instructorId);

            if (instructor == null)
                return new List<CourseDto>();

            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    InstructorName = instructor.Name
                })
                .ToListAsync();
        }

        public async Task<InstructorDto?> GetByUserIdAsync(string userId)
        {
            return await _context.Instructors
                .Include(i => i.Profile)
                .AsNoTracking()
                .Where(i => i.UserId == userId)
                .Select(i => new InstructorDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Email = i.Profile != null ? i.Profile.Email : string.Empty
                })
                .FirstOrDefaultAsync();
        }
    }
}