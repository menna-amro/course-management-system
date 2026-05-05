using Microsoft.EntityFrameworkCore;
using CourseManagementAPI;
using CourseManagementAPI.DTOs;
using CourseManagementAPI.Services.Interfaces;
using CourseManagementAPI.Models;
using CourseManagementAPI.DTOs.Student;

namespace CourseManagementAPI.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;
 
        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StudentDto>> GetAllAsync()
        {
            return await _context.Students
                .AsNoTracking() 
                .Select(s => new StudentDto    //mapping 
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email
                })
                .ToListAsync();   //returns a list of students
        }

        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            return await _context.Students
                .AsNoTracking()
                .Where(s => s.Id == id)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email
                })
                .FirstOrDefaultAsync();  //returns a single student or null if not found
        }

        public async Task<StudentDto?> GetByUserIdAsync(string userId)
        {
            return await _context.Students
                .Where(s => s.UserId == userId)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email
                })
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(CreateStudentDto dto, string userId)
        {
            var studentExists =
                await _context.Students
                .AnyAsync(s => s.UserId == userId);

            if (studentExists)
                throw new Exception("Student profile already exists");

            var emailInStudentProfiles = await _context.Students
                .AnyAsync(s => s.Email == dto.Email);

            if (emailInStudentProfiles)
                throw new Exception("A profile with this email already exists.");

            var emailInInstructorProfiles = await _context.InstructorProfiles
                .AnyAsync(p => p.Email == dto.Email);

            if (emailInInstructorProfiles)
                throw new Exception("A profile with this email already exists.");

            var instructorExists =
                await _context.Instructors
                .AnyAsync(i => i.UserId == userId);

            if (instructorExists)
                throw new Exception("Instructor cannot create student profile");

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                UserId = userId
            };

            try
            {
                _context.Students.Add(student);
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

        public async Task UpdateAsync(int id, UpdateStudentDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return;

            if (!string.IsNullOrEmpty(dto.Name))
                student.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Email))
                student.Email = dto.Email;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateByUserIdAsync(string userId, UpdateStudentDto dto)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null) 
                return;

            // Check if new email is unique (excluding current profile)
            if (!string.IsNullOrEmpty(dto.Email) && dto.Email != student.Email)
            {
                var emailExists = await _context.Students
                    .AnyAsync(s => s.Email == dto.Email && s.Id != student.Id);
                
                if (emailExists)
                    throw new Exception("Email already exists for another profile");

                var instructorEmailExists = await _context.InstructorProfiles
                    .AnyAsync(p => p.Email == dto.Email);
                
                if (instructorEmailExists)
                    throw new Exception("Email already exists in instructor profiles");
            }

            if (!string.IsNullOrEmpty(dto.Name))
                student.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Email))
                student.Email = dto.Email;

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<EnrollmentDto>> GetCoursesAsync(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
            {
                return new List<EnrollmentDto>();
            }

            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .AsNoTracking()
                .Select(e => new EnrollmentDto
                {
                    StudentId = e.StudentId,
                    CourseId = e.CourseId,
                    StudentName = e.Student.Name,
                    CourseTitle = e.Course.Title,
                    InstructorName = e.Course.Instructor.Name
                })
                .ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) 
                return;

            // Remove any remaining enrollments (safety)
            var remainingEnrollments = await _context.Enrollments
                .Where(e => e.StudentId == id)
                .ToListAsync();
            _context.Enrollments.RemoveRange(remainingEnrollments);

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }
    }
}
